const https = require("http");
const express = require("express");
const path = require("path");
const db = require("./models");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("./helpers/passport")(passport);

var app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(__dirname + "/images"));
app.use(express.static(__dirname + "/build"));

const userRoutes = require("./routes/UserRoutes");
const filesRoutes = require("./routes/FilesRoutes");
const favoriteRoutes = require("./routes/FavoriteRoutes");
const VideoRoute = require("./routes/VideoRouter");

// Administrator
const UsersManagerRoute = require("./routes/admin/UsersManagerRoute");
const DirectoriesRoute = require("./routes/admin/DirectoriesRoute");
const FilesManagerRoute = require("./routes/admin/FilesManagerRoute");
const FoldersRoute = require("./routes/admin/FoldersRoute");
const sessionMeddle = session({
  name: "rcm",
  secret: "2491eb2c-595d-4dc8-8427",
  resave: true,
  saveUninitialized: false,
  maxAge: 60000,
});
app.use(sessionMeddle);

app.use(passport.initialize());
app.use(passport.session());

// it is here because is needed for login before access the other routes;
app.use("/api/users", userRoutes);

app.use((req, res, next) => {
  if (!/login|api\/users\/login/gi.test(req.url) && !req.user) {
    console.log("not user");
    return res.redirect("/login");
  }
  return next();
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

app.get("/*", (req, res) => {
  console.log("data");
  return res.sendFile(path.join(__dirname + "/build/index.html"));
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

  return require("./modules/socketio-server")(server, sessionMeddle);
});

console.log(process.env.NODE_ENV);
