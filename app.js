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
const VideoRoute = require("./routes/VideoRouter");

// Administrator
const UsersManagerRoute = require("./routes/admin/UsersManagerRoute");
const DirectoriesRoute = require("./routes/admin/DirectoriesRoute");
const FilesManagerRoute = require("./routes/admin/FilesManagerRoute");
const FoldersRoute = require("./routes/admin/FoldersRoute");

app.use(
  session({
    name: "rcm",
    secret: "2491eb2c-595d-4dc8-8427",
    resave: true,
    saveUninitialized: false,
    maxAge: 60000,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  if (!/login|api\/users\/login/gi.test(req.url) && !req.user) {
    return res.redirect("/login");
  }
  if (req.user) {
    app.locals.user = req.user;
  }
  return next();
});

// it is here because is needed for login before access the other routes;
app.use("/api/users", userRoutes);

app.use("/login", (req, res) => {
  return res.sendFile(path.join(__dirname + "/public/login.html"));
});

app.use("/api/files/favorites", favoriteRoutes);
app.use("/api/files", filesRoutes);
app.use("/api/videos", VideoRoute);

app.use("/api/admin", (req, res, next) => {
  if (!req.user.Role.includes("Administrator")) {
    return res.redirect("/notfound");
  }
  next();
});

app.use("/api/admin/users", UsersManagerRoute);
app.use("/api/admin/directories", DirectoriesRoute);
app.use("/api/admin/files", FilesManagerRoute);
app.use("/api/admin/folders", FoldersRoute);

app.use("/admin", (req, res) => {
  if (!req.user.Role.includes("Administrator")) {
    return res.redirect("/notfound");
  }
  return res.sendFile(path.join(__dirname + "/react-admin/build/index.html"));
});

app.get("/notfound", (req, res) => {
  return res.sendFile(path.join(__dirname + "/notfound.html"));
});

app.get("/*", (req, res) => {
  return res.sendFile(path.join(__dirname + "/react-client/build/index.html"));
});

app.use((e, req, res, next) => {
  if (e.message.includes("Failed to decode param")) {
    return res.redirect("/notfound");
  }
});

const port = 3001;

db.init().then(() => {
  let server = https
    .createServer(
      // {
      //   key: fs.readFileSync("./cert/server.key"),
      //   cert: fs.readFileSync("./cert/server.cert")
      // },
      app
    )
    .listen(port);

  console.log("Node server is running.. at http://localhost:" + port);

  return require("./modules/socketio-server")(server, app);
});

console.log(process.env.NODE_ENV);
