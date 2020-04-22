var express = require("express");
var Router = express.Router();
const fs = require("fs");
const path = require("path");
const db = require("../models");

getAttributes = (user, file) => {
  return (attributes = [
    "Id",
    "Name",
    "Type",
    "Duration",
    "Cover",
    "FolderId",
    "ViewCount",
    [
      db.sqlze.literal(
        `IFNULL((Select LastPos from RecentFiles where FileId == ${file}.Id and RecentId == '${user.Recent.Id}'), 0)`
      ),
      "CurrentPos",
    ],
  ]);
};

const getFiles = async (req, res, type) => {
  let user = req.user;
  const id = req.body.id;
  let table = await db[type].findOne({
    where: { Id: id },
    order: [db.sqlze.literal("REPLACE(`Files`.`Name`, '[','0')")],
    include: {
      model: db.file,
      attributes: getAttributes(user, "Files"),
    },
  });

  res.send({
    files: table.Files.map((f) => f.dataValues),
    config: user.UserConfig.dataValues.Config,
  });
};

Router.post("/file/", (req, res) => {
  let id = req.body.id;

  db.file
    .findOne({ where: { Id: id }, attributes: getAttributes(req.user, "File") })
    .then((file) => {
      if (file) {
        let config = req.user.UserConfig.dataValues.Config;
        res.send({ files: [], file: file.dataValues, config });
      } else {
        res.send({ fail: true, msg: "File Not Found" });
      }
    });
});

Router.post("/folder/", (req, res) => {
  getFiles(req, res, "folder");
});

Router.post("/favorites/", (req, res) => {
  getFiles(req, res, "favorite");
});

Router.get("/:id", (req, res) => {
  db.file
    .findOne({
      attributes: ["FullPath", "Name", "Size"],
      where: { Id: req.params.id },
    })
    .then((file) => {
      if (file) {
        var total = file.Size;
        var range = req.headers.range;
        if (!range) {
          // 416 Wrong range
          return res.sendStatus(416);
        }
        var positions = range.replace(/bytes=/, "").split("-");
        var start = parseInt(positions[0], 10);
        if (start === 0) {
          if (!fs.existsSync(path.join(file.FullPath, file.Name)))
            return res.sendStatus(404);
        }

        // same code as accepted answer
        var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
        var chunksize = end - start + 1;
        // poor hack to send smaller chunks to the browser
        var maxChunk = 1024 * 1024; // 1MB at a time
        if (chunksize > maxChunk) {
          end = start + maxChunk - 1;
          chunksize = end - start + 1;
        }
        res.writeHead(206, {
          "Content-Range": "bytes " + start + "-" + end + "/" + total,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize,
          "Content-Type": "video/mp4",
        });

        var stream = fs
          .createReadStream(path.join(file.FullPath, file.Name), {
            start: start,
            end: end,
          })
          .on("open", function () {
            stream.pipe(res);
          })
          .on("error", function (err) {
            res.end(err);
          });
      } else {
        res.send("error");
      }
    });
});

//export this Router to use in our index.js
module.exports = Router;
