const Router = require("express").Router();
const db = require("../../models");
const fs = require("fs-extra");
const path = require("path");

const getData = async (req, res) => {
  let { page, items } = req.params;
  let offset = (page - 1) * items || 0;
  let limit = items || 10;
  let folders = await db.folder.findAndCountAll({ order: ["Name"], offset, limit });

  let files = { rows: [], count: 0 };
  if (folders.rows.length > 0) {
    files = await db.file.findAndCountAll({
      order: [db.sqlze.literal(`REPLACE(Name, '[','0')`)],
      offset: 0,
      limit,
      where: { FolderId: folders.rows[0].Id },
    });
  }
  let totalFolderPages = Math.ceil(folders.count / items);
  let totalFilePages = Math.ceil(files.count / items);
  res.send({
    folders: folders.rows,
    totalFolderPages,
    totalFolders: folders.count,
    files: files.rows,
    totalFilePages,
    totalFiles: files.count,
  });
};

Router.get("/:page/:items", (req, res) => {
  getData(req, res).catch((err) => {
    console.log(err);
  });
});

Router.get("/files/:folderId/:page/:items", (req, res) => {
  let { folderId, page, items } = req.params;
  let offset = (page - 1) * items || 0;
  let limit = items || 10;
  db.file
    .findAndCountAll({
      order: [db.sqlze.literal(`REPLACE(Name, '[','0')`)],
      where: { FolderId: folderId },
      offset,
      limit,
    })
    .then((result) => {
      res.send({
        files: result.rows,
        totalFilePages: Math.ceil(result.count / items),
        totalFiles: result.count,
      });
    });
});

const removeFolder = async (req, res) => {
  let { Id } = req.body;
  let folder = await db.folder.findOne({ where: { Id } });
  if (folder) {
    try {
      await folder.destroy();
      fs.removeSync(
        path.join(process.cwd(), "public", "covers", "folder", folder.Name + ".jpg")
      );
      return res.send({ success: true });
    } catch (err) {
      console.log(err);
    }
  }
  return res.send({ success: false });
};

Router.delete("/remove-folder", (req, res) => {
  removeFolder(req, res);
});

module.exports = Router;
