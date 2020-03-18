const Router = require("express").Router();

const passport = require("passport");

Router.get("/getuser", (req, res) => {
  return res.json({
    username: req.user ? req.user.Name : "",
    isAutenticated: req.user !== undefined,
    favorites: req.user ? req.user.Favorites : []
  });
});

Router.post("/login", (req, res, next) => {
  return passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (user) {
      return req.logIn(user, err => {
        if (err) return next(err);
        return res.json({
          username: user.Name,
          isAutenticated: true,
          favorites: user.Favorites
        });
      });
    } else {
      return res.json(info);
    }
  })(req, res, next);
});

Router.post("/logout", (req, res) => {
  req.session.destroy();
  return res.send("ok");
});

module.exports = Router;
