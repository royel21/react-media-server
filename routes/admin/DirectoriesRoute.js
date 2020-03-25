const Router = require("express").Router();
const fs = require("fs-extra");
const path = require("path");
const winEx = require("win-explorer");

const db = require("../../models");

const getNewId = () => {
  return Math.random()
    .toString(36)
    .slice(-5);
};

Router.get("/", (req, res) => {
  db.directory
    .findAll({ order: ["FullPath"] })
    .then(data => {
      let dirs = data.map(d => d.dataValues);
      res.send(dirs);
    })
    .catch(err => {
      console.log(err);
      res.send({ err: true, msg: "Server Error 500" });
    });
});

Router.delete("/remove", (req, res) => {
  let { Id } = req.body;
  db.directory
    .destroy({ where: { Id } })
    .then(result => {
      if (result > 0) {
        res.send({ removed: true });
      } else {
        res.send({ removed: false, msg: "Can't find folder by Id" });
      }
    })
    .catch(err => {
      console.log(err);
      res.send({ removed: false, msg: "Server error 500" });
    });
});

Router.post("/content", (req, res) => {
  let { Id, Path } = req.body;
  if (fs.existsSync(Path)) {
    let dirs = winEx.ListFiles(Path, { directory: true });
    let tdata = [];
    for (let d of dirs) {
      tdata.push({
        Id: getNewId(),
        Name: d.FileName,
        Path: path.join(Path, d.FileName),
        Content: []
      });
    }
    res.send({ data: tdata, Id });
  }
});

module.exports = Router;
