const Router = require("express").Router();

const db = require("../models");

const { getFilesList } = require("../helpers/query-helper");

Router.get("/:id/:order/:page/:items/:search?", (req, res) => {
  getFilesList(req.user, res, null, req.params, db.favorite);
});

const saveEdit = async (req, res) => {
  let { Id, Name } = req.body;
  let fav = await db.favorite.findOrCreate({ where: { Id }, defaults: { Name } });
  console.log(fav);
  if (fav[1]) {
    console.log(req.user, fav[0]);
    await req.user.addFavorite(fav[0]);
  } else {
    await fav[0].update({ Name });
  }

  res.send({ fav: fav[0], New: fav[1] });
};

Router.post("/add-edit", (req, res) => {
  if (req.body.Name) return res.send("Name Can't Be Empty");

  saveEdit(req, res)
    .then(() => {
      return null;
    })
    .catch(err => {
      console.log(err);
    });
});

Router.get("/favorite/remove", (req, res) => {
  res.send("ok");
});

module.exports = Router;
