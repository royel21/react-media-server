const Router = require("express").Router();

const db = require("../models");
const { getFiles, getFolders } = require("../helpers/query-helper");

const getFileList = async (user, res, type, params, model) => {
  let data = {};
  try {
    data = await getFiles(user, { type, ...params }, model);
  } catch (err) {
    console.log(err);
  }

  return res.json({
    files: data.rows,
    totalFiles: data.count,
    totalPages: Math.ceil(data.count / params.items),
    favorities: data.favorities
  });
};

Router.get("/mangas/:order/:page?/:items?/:search?", (req, res) => {
  getFileList(req.user, res, "Manga", req.params);
});

Router.get("/videos/:order/:page?/:items?/:search?", (req, res) => {
  return getFileList(req.user, res, "Video", req.params);
});

Router.get("/folders/:order/:page?/:items?/:search?", getFolders);

Router.get("/folder-content/:id/:order/:page?/:items?/:search?", (req, res) => {
  getFileList(req.user, res, null, req.params, db.folder);
});

Router.get("/favorities/:id/:order/:page/:items/:search?", (req, res) => {
  getFileList(req.user, res, null, req.params, db.favorite);
});

Router.get("/favorite", (req, res) => {
  req.user
    .getFavorites({ attributes: ["Id", "Name"], order: ["Name"] })
    .then(result => {
      if (result.length > 0) {
        return res.send(result.map(f => f.dataValues));
      } else {
        return res.send([]);
      }
    });
});

module.exports = Router;
