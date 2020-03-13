let LocalStrategy = require("passport-local").Strategy;
let db = require("./models");

module.exports = passport => {
  passport.serializeUser((user, done) => done(null, user.Name));

  passport.deserializeUser((username, done) => {
    db.user
      .findOne({
        where: {
          Name: username
        },
        include: [{ model: db.userConfig }, { model: db.recent }]
      })
      .then(user => {
        if (user) {
          return done(null, user);
        } else {
          done(new Error("Wrong user Name."));
        }
      })
      .catch(err => {
        console.log(err);
        return err;
      });
  });

  passport.use(
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password"
      },
      function(username, password, done) {
        // if (username == null || username == "") {
        //   return done(null, false, { message: "User Can't be empty" });
        // } else if (password == "" || password == undefined) {
        //   return done(null, false, { message: "Password can't be empty" });
        // }

        return db.user
          .findOne({
            where: {
              Name: username
            },
            include: [
              { model: db.userConfig },
              { model: db.favorite },
              { model: db.recent }
            ]
          })
          .then(user => {
            if (user) {
              user.validPassword(password).then(result =>
                done(null, result ? user : false, {
                  type: "pass",
                  message: "Wrong Incorrect"
                })
              );
            } else {
              console.log("error");
              return done(null, false, {
                type: "user",
                message: `${username} is no authorized`
              });
            }
          })
          .catch(err => {
            done(err, false);
            return err;
          });
      }
    )
  );
};
