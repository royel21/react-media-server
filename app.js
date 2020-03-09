const https = require("http");
const express = require("express");
const path = require("path");
const db = require("./models");
const { getFiles } = require("./query-helper");

const app = express();

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/react-client/build"));

const getFileList = async (res, type, params) => {
  let user = await db.user.findOne({
    where: { Name: "Royel" },
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

app.get("/api/getmangas/:order/:page?/:itemsperpage?/:search?", (req, res) => {
  console.time("start");
  getFileList(res, "Manga", req.params).catch(err => {
    console.timeEnd("start");
    console.log(err);
  });
});

app.get("/api/getvideos/:order/:page?/:itemsperpage?/:search?", (req, res) => {
  console.time("start");
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
