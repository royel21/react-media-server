const Router = require("express").Router();
const db = require("../../models");
const fs = require("fs-extra");
const path = require("path");

const getCoverPath = (name) => {
  return path.join(process.cwd(), "public", "covers", "folder", name + ".jpg");
};

const getData = async (req, res) => {
  let { page, items, filter } = req.params;
  let offset = (page - 1) * items || 0;
  let limit = items || 10;
  let folders = await db.folder.findAndCountAll({
    order: ["Name"],
    offset,
    limit,
    where: {
      Name: { [db.Op.like]: `%${filter || ""}%` },
    },
  });

  let files = { rows: [], count: 0 };
  if (folders.rows.length > 0) {
    files = await db.file.findAndCountAll({
      order: [db.sqlze.literal(`REPLACE(Name, '[','0')`)],
      offset: 0,
      limit,
      where: {
        FolderId: folders.rows[0].Id,
      },
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

Router.get("/:page/:items/:filter?", (req, res) => {
  getData(req, res).catch((err) => {
    console.log(err);
  });
});

Router.get("/files/:folderId/:page/:items/:filter?", (req, res) => {
  let { folderId, page, items, filter } = req.params;
  let offset = (page - 1) * items || 0;
  let limit = items || 10;
  db.file
    .findAndCountAll({
      order: [db.sqlze.literal(`REPLACE(Name, '[','0')`)],
      where: {
        [db.Op.and]: {
          FolderId: folderId,
          Name: { [db.Op.like]: `%${filter || ""}%` },
        },
      },
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

const editFolder = async (req, res) => {
  let { Id, Name } = req.body;
  let folder = await db.folder.findOne({
    where: { Id },
    include: { model: db.directory },
  });
  if (folder) {
    try {
      let basePath = folder.Directory.FullPath;

      const oldPath = path.join(basePath, folder.Name);
      let FullPath = path.join(basePath, Name);
      fs.moveSync(oldPath, FullPath);
      fs.moveSync(getCoverPath(folder.Name), getCoverPath(Name));
      await folder.update({ Name });
      return res.send({ success: true });
    } catch (err) {
      console.log(err);
    }
    return res.send({ success: false });
  }
};

Router.post("/edit-folder", (req, res) => {
  editFolder(req, res);
});

const removeFolder = async (req, res) => {
  let { Id } = req.body;
  let folder = await db.folder.findOne({ where: { Id } });
  if (folder) {
    try {
      await folder.destroy();
      fs.removeSync(getCoverPath(folder.Name));
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
