const Router = require("express").Router();

const db = require("../../models");

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

module.exports = Router;
