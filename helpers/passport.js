let LocalStrategy = require("passport-local").Strategy;
let db = require("../models");

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    return done(null, user.Name);
  });
  passport.deserializeUser((username, done) => {
    db.user
      .findOne({
        order: [db.sqlze.literal("LOWER(Favorites.Name)")],
        where: {
          Name: username,
        },
        include: [
          { model: db.userConfig },
          { model: db.recent },
          { model: db.favorite, attributes: ["Id", "Name", "Type"] },
        ],
      })
      .then((user) => {
        if (user) {
          return done(null, user);
        } else {
          return done(null, false, {
            type: "user",
            message: `${username} is no authorized`,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
  });

  passport.use(
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
      },
      function (username, password, done) {
        return db.user
          .findOne({
            order: [db.sqlze.literal("LOWER(Favorites.Name)")],
            where: {
              Name: username,
            },
            include: [
              { model: db.userConfig },
              { model: db.recent },
              { model: db.favorite, attributes: ["Id", "Name", "Type"] },
            ],
          })
          .then((user) => {
            if (user) {
              user.validPassword(password).then((result) => {
                if (result) {
                  done(null, user);
                } else {
                  done(null, false, {
                    type: "pass",
                    message: "Password Incorrect",
                  });
                }
              });
            } else {
              return done(null, false, {
                type: "user",
                message: `${username} is no authorized`,
              });
            }
          })
          .catch((err) => {
            done(err, false);
            return err;
          });
      }
    )
  );
};
