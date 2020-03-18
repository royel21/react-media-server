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
      console.log(err.message);

      res.json({ created: false, msg: err.message });
    });
});

const removeFav = async req => {
  let favs = await req.user.getFavorites();

  if (favs.length > 1) {
    let fav = favs.find(f => f.Id === req.body.Id);
    if (fav) {
      await req.user.removeFavorite(fav);
      result = await fav.destroy();
      return { removed: result !== null };
    }
  } else {
    return { removed: false, msg: "Can't delete last favorite" };
  }
  return { removed: false, msg: `Favorite Id:${req.body.Id} not found` };
};

Router.delete("/remove", (req, res) => {
  removeFav(req)
    .then(result => {
      return res.send(result);
    })
    .catch(err => {
      console.log(err.name);

      res.send({ removed: true, msg: "Internal Server Error 500" });
    });
});

module.exports = Router;
