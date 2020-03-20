const Router = require("express").Router();

const passport = require("passport");

Router.get("/getuser", (req, res, next) => {
  // let user = req.user || {};
  // console.log(user);
  // return res.json({
  //   role: user.Role || "",
  //   username: user.Name || "",
  //   isAutenticated: req.user !== undefined,
  //   favorites: user.Favorites || []
  // });
  req.body.username = "Administrator";
  req.body.password = "Admin";
  passport.authenticate("local", function(err, user, info) {
    return res.json({
      role: user.Role || "",
      username: user.Name || "",
      isAutenticated: user !== undefined,
      favorites: user.Favorites || []
    });
  })(req, res, next);
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

module.exports = Router;
