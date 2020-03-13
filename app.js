const https = require("http");
const express = require("express");
const path = require("path");
const db = require("./models");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const mypassport = require("./passport")(passport);
const { getFiles } = require("./query-helper");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/react-client/build"));

app.use(
  session({
    secret: "2491eb2c-595d-4dc8-8427",
    resave: true,
    saveUninitialized: true,
    maxAge: 60000
  })
);

app.use(passport.initialize());
app.use(passport.session());

const getFileList = async (res, type, params) => {
  let user = await db.user.findOne({
    where: { Name: "Administrator" },
    include: { model: db.recent }
  });

  let data = await getFiles(user, { type, ...params }, null, "nu");

  res.json({
    files: data.rows,
    totalFiles: data.count,
    totalPages: Math.ceil(data.count / params.itemsperpage)
  });
  console.timeEnd("start");
};

const userIsautenticated = (req, res) => {
  let user = {};

  if (req.user) {
    user.username = req.user.Name;
    user.isAutenticated = true;
  } else {
    user.username = "";
    user.isAutenticated = false;
  }
  console.log(user, user);
  return res.json(user);
};
app.get("/api/user/getuser", userIsautenticated);

app.post("/api/user/login", passport.authenticate("local"), userIsautenticated);

app.post("/api/user/logout", (req, res) => {
  if (req.user) {
    req.session.destroy();
  }
  return res.send("ok");
});

app.get("/api/getmangas/:order/:page?/:itemsperpage?/:search?", (req, res) => {
  console.time("start");
  console.log(req.url);
  getFileList(res, "Manga", req.params).catch(err => {
    console.timeEnd("start");
    console.log(err);
  });
});

app.get("/api/getvideos/:order/:page?/:itemsperpage?/:search?", (req, res) => {
  console.time("start");
  console.log(req.url);
  getFileList(res, "Video", req.params).catch(err => {
    console.timeEnd("start");
    console.log(err);
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/react-client/build/index.html"));
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
});

console.log(process.env.NODE_ENV);
