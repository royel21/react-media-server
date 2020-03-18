const Router = require("express").Router();

const db = require("../models");
const { getFilesList, getFolders } = require("../helpers/query-helper");

Router.get("/mangas/:order/:page?/:items?/:search?", (req, res) => {
  getFilesList(req.user, res, "Manga", req.params);
});

Router.get("/videos/:order/:page?/:items?/:search?", (req, res) => {
  return getFilesList(req.user, res, "Video", req.params);
});

Router.get("/folders/:order/:page?/:items?/:search?", getFolders);

Router.get("/folder-content/:id/:order/:page?/:items?/:search?", (req, res) => {
  getFilesList(req.user, res, null, req.params, db.folder);
});

module.exports = Router;
