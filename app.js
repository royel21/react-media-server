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
app.use(express.static(__dirname + "/react-admin/build"));

const userRoutes = require("./routes/UserRoutes");
const filesRoutes = require("./routes/FilesRoutes");
const favoriteRoutes = require("./routes/FavoriteRoutes");
const UsersManagerRoute = require("./routes/admin/UsersManagerRoute");
const DirectoriesRoute = require("./routes/admin/DirectoriesRoute");
const FilesManagerRoute = require("./routes/admin/FilesManagerRoute");
const VideoRoute = require("./routes/VideoRouter");

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
// it is here because is needed for login before access the other routes;
app.use("/api/users", userRoutes);

app.use("/login", (req, res) => {
  console.log("login");
  return res.sendFile(path.join(__dirname + "/public/login.html"));
});

app.use("/*", (req, res, next) => {
  // console.log("origin", req.get("origin"));
  app.locals.user = req.user;
  if (req.user) return next();
  // next();
  return res.redirect("/login");
});

app.use("/api/files/favorites", favoriteRoutes);
app.use("/api/files", filesRoutes);
app.use("/api/videos", VideoRoute);
app.use("/api/admin/users", UsersManagerRoute);
app.use("/api/admin/directories", DirectoriesRoute);
app.use("/api/admin/files", FilesManagerRoute);

app.use("/admin", (req, res) => {
  console.log("/admin");
  return res.sendFile(path.join(__dirname + "/react-admin/build/index.html"));
});

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

  return require("./modules/socketio-server")(server, app);
});

console.log(process.env.NODE_ENV);
