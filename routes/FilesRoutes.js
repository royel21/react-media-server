const Router = require("express").Router();

const db = require("../models");
const { getFiles } = require("../helpers/query-helper");

const isAuth = (req, res, next) => {
  if (req.user) return next();
  return res.redirect("/notfound");
};

const getFileList = async (res, type, params) => {
  let user = await db.user.findOne({
    where: { Name: "Administrator" },
    include: { model: db.recent }
  });

  let data = await getFiles(user, { type, ...params }, null, "nu");

  console.timeEnd("start");
  return res.json({
    files: data.rows,
    totalFiles: data.count,
    totalPages: Math.ceil(data.count / params.itemsperpage)
  });
};

Router.get(
  "/mangas/:order/:page?/:itemsperpage?/:search?",
  isAuth,
  (req, res) => {
    console.time("start");
    return getFileList(res, "Manga", req.params);
  }
);

Router.get(
  "/videos/:order/:page?/:itemsperpage?/:search?",
  isAuth,
  (req, res) => {
    console.time("start");
    return getFileList(res, "Video", req.params);
  }
);

module.exports = Router;
