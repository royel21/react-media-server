const Router = require("express").Router();

const db = require("../models");
const { getFiles, getFolders } = require("../helpers/query-helper");

const getFileList = async (user, res, type, params, model) => {
  let data = await getFiles(user, { type, ...params }, model);

  console.timeEnd("start");
  return res.json({
    files: data.rows,
    totalFiles: data.count,
    totalPages: Math.ceil(data.count / params.itemsperpage)
  });
};

Router.get("/mangas/:order/:page?/:itemsperpage?/:search?", (req, res) => {
  console.time("start");
  getFileList(req.user, res, "Manga", req.params);
});

Router.get("/videos/:order/:page?/:itemsperpage?/:search?", (req, res) => {
  console.time("start");
  return getFileList(req.user, res, "Video", req.params);
});

Router.get("/folders/:order/:page?/:itemsperpage?/:search?", getFolders);

Router.get(
  "/folder-content/:id/:order/:page?/:itemsperpage?/:search?",
  (req, res) => {
    console.time("start");
    console.log(req.url);
    getFileList(req.user, res, null, req.params, db.folder)
      .then(() => {
        return null;
      })
      .catch(err => {
        console.log(err);
      });
  }
);

module.exports = Router;
