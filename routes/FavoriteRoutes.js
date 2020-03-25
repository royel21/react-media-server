const Router = require("express").Router();

const db = require("../models");

const { getFilesList } = require("../helpers/query-helper");

Router.get("/:id/:order/:page/:items/:search?", (req, res) => {
  getFilesList(req.user, res, null, req.params, db.favorite);
});

const saveEdit = async (req, res) => {
  let { Id, Name, Type } = req.body;
  let fav = await db.favorite.findOne({ where: { Id } });
  if (!fav) {
    fav = await db.favorite.create({ Name, Type, UserId: req.user.Id });
  } else {
    await fav.update({ Name });
  }

  res.json({ Id: fav.Id, Name, Type });
};

Router.post("/add-edit", (req, res) => {
  if (!req.body.Name) return res.send(false);

  saveEdit(req, res)
    .then(() => {
      return null;
    })
    .catch(err => {
      console.log(err);

      res.json({ created: false, msg: err.message });
    });
});

const removeFav = async req => {
  let { Id, Type } = req.body;
  let favs = await req.user.getFavorites({ where: { Type } });
  if (favs.length > 1) {
    let fav = favs.find(f => f.Id === Id);
    if (fav) {
      await req.user.removeFavorite(fav);
      result = await fav.destroy();
      return { removed: result !== null };
    }
  } else {
    return { removed: false, msg: "Can't delete last favorite Type " + Type };
  }
  return { removed: false, msg: `Favorite Id:${Id} not found` };
};

Router.delete("/remove", (req, res) => {
  removeFav(req)
    .then(result => {
      return res.send(result);
    })
    .catch(err => {
      console.log(err);
      res.send({ removed: true, msg: "Internal Server Error 500" });
    });
});

Router.post("/add-file", (req, res) => {
  const { FavoriteId, FileId } = req.body;
  db.favoriteFile
    .create({ FileId, FavoriteId })
    .then(result => {
      return res.send(result !== null);
    })
    .catch(err => {
      console.log(err);
      return res.send(false);
    });
});

const removeFile = async (req, res) => {
  const { id, fid } = req.body;
  let result = await db.favoriteFile.destroy({
    where: { FileId: fid, FavoriteId: id }
  });
  if (result > 0) {
    let data = await getFilesList(req.user, null, null, req.body, db.favorite);
    return { removed: true, data };
  } else {
    return { removed: false };
  }
};

Router.post("/remove-file", (req, res) => {
  removeFile(req)
    .then(result => {
      return res.send(result);
    })
    .catch(err => {
      console.log(err);
      res.send({ removed: false, msg: "Internal Server Error 500" });
    });
});

module.exports = Router;
