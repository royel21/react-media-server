const Router = require("express").Router();

const passport = require("passport");

Router.get("/getuser", (req, res) => {
  if (!req.user) return res.send({});

  let user = req.user || { UserConfig: { dataValues: {} } };
  return res.json({
    role: user.Role || "",
    username: user.Name || "",
    isAutenticated: req.user !== undefined,
    favorites: user.Favorites || [],
    Config: user.UserConfig.dataValues.Config
  });
});

Router.post("/login", (req, res, next) => {
  return passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (user) {
      return req.logIn(user, err => {
        if (err) return next(err);
        return res.json({
          isAutenticated: true,
          redirect: user.Role.includes("Administrator") ? "/admin" : "/"
        });
      });
    } else {
      return res.json({ isAutenticated: false, info });
    }
  })(req, res, next);
});

Router.post("/logout", (req, res) => {
  req.session.destroy();
  return res.send("ok");
});

Router.get("/userconfig", (req, res) => {
  if (!req.user) return res.send({});
  let config = req.user.UserConfig.Config;
  return res.send(config);
});

module.exports = Router;
