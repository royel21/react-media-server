const Router = require("express").Router();

const db = require("../../models");

Router.get("/users", (req, res) => {
  console.log(req);
  db.user.findAll({ order: ["Name"] }).then(users => {
    return res.send({ users: users.map(u => u.dataValues) });
  });
});

Router.get("/add-edit", (req, res) => {
  db.user.findAll({ order: ["Name"] }).then(users => {
    return res.send({ users: users.map(u => u.dataValues) });
  });
});

Router.get("/remove", (req, res) => {
  db.user.findAll({ order: ["Name"] }).then(users => {
    return res.send({ users: users.map(u => u.dataValues) });
  });
});

module.exports = Router;
