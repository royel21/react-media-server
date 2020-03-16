const https = require("http");
const express = require("express");
const path = require("path");
const db = require("./models");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("./helpers/passport")(passport);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/react-client/build"));

const userRoutes = require("./routes/UserRoutes");
const filesRoutes = require("./routes/FilesRoutes");
const favoriteRoutes = require("./routes/FavoriteRoutes");

app.use(
  session({
    name: "rcm",
    secret: "2491eb2c-595d-4dc8-8427",
    resave: true,
    saveUninitialized: false,
    maxAge: 60000
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/users", userRoutes);

app.use("/api/*", (req, res, next) => {
  console.log(req.url);
  // next();
  if (req.user) return next();
  return res.redirect("/notfound");
});

app.use("/api/files/favorities", favoriteRoutes);

app.use("/api/files", filesRoutes);

app.get("/notfound", (req, res) => {
  return res.sendFile(path.join(__dirname + "/notfound.html"));
});

app.get("/*", (req, res) => {
  return res.sendFile(path.join(__dirname + "/react-client/build/index.html"));
});

const port = 3001;

db.init().then(() => {
  let server = https
    .createServer(
      // {
      //     key: fs.readFileSync('./cert/server.key'),
      //     cert: fs.readFileSync('./cert/server.cert')
      // },
      app
    )
    .listen(port);

  console.log("Node server is running.. at http://localhost:" + port);

  // return require("./modules/socketio-server")(server, app);
  return server;
});

console.log(process.env.NODE_ENV);
