const Router = require("express").Router();
const fs = require("fs-extra");
const path = require("path");

const db = require("../../models");

Router.get("/:page/:items/:filter?", (req, res) => {
  let { page, items, filter } = req.params;

  db.file
    .findAndCountAll({
      order: [db.sqlze.literal("REPLACE(File.Name, '[','0')")],
      attribute: ["Id", "Name", "FullPath", "ViewCount"],
      offset: ((page || 1) - 1) * items,
      limit: items || 12,
      where: {
        Name: {
          [db.Op.like]: "%" + (filter || "") + "%"
        }
      }
    })
    .then(files => {
      let data = {
        files: [],
        totalPages: Math.ceil(files.count / items),
        totalFiles: files.count
      };

      data.files = files.rows.map(f => f.dataValues);

      res.send(data);
    })
    .catch(err => {
      res.send({ msg: "Server Error 500" });
    });
});

const renameFile = async (req, res) => {
  const { Id, Name } = req.body;

  let file = await db.file.findByPk(Id);
  if (file) {
    let fromFile = path.join(file.FullPath, file.Name);
    let toFile = path.join(file.FullPath, Name);

    let fromCover = path.join("./public", file.Cover);
    let toCover = path.join(path.dirname(fromCover), Name + ".jpg");

    try {
      console.log(fromCover, toCover);
      await db.file.update({ Name, Type: file.Type, Cover: "" }, { where: { Id } });
      fs.moveSync(fromFile, toFile);
      fs.moveSync(fromCover, toCover);
      res.send({ fail: false });
    } catch (err) {
      console.log(err);
    }
  } else {
    res.send({ fail: true, msg: `File was not found` });
  }
};

Router.post("/edit", (req, res) => {
  return renameFile(req, res);
});

module.exports = Router;
