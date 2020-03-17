const Router = require("express").Router();

const db = require("../models");

const { getFilesList } = require("../helpers/query-helper");

Router.get("/:id/:order/:page/:items/:search?", (req, res) => {
  getFilesList(req.user, res, null, req.params, db.favorite);
});

const saveEdit = async (req, res) => {
  let { Id, Name } = req.body;
  let fav = await db.favorite.findOne({ where: { Id } });

  if (!fav) {
    fav = await db.favorite.create({ Name });
    await req.user.addFavorite(fav);
  } else {
    await fav.update({ Name });
  }

  res.json({ Id: fav.Id, Name });
};

Router.post("/add-edit", (req, res) => {
  if (!req.body.Name) return res.send(false);

  saveEdit(req, res)
    .then(() => {
      return null;
    })
    .catch(err => {
      console.log(err);
      res.json({ error: "Other error" });
    });
});
const removeFav = async req => {
  let Id = req.body.id;
  console.log(req.body);
  if (!Id) return false;
  let fav = await db.favorite.findOne({ where: { Id } });
  if (fav) {
    let result = await req.user.removeFavorite(fav);
    return result > 0;
  }
  return false;
};
Router.delete("/remove", (req, res) => {
  removeFav(req).then(result => {
    return res.send(result);
  });
});

module.exports = Router;
