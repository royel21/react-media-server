const FileManager = require("./file-manager");
const mloader = require("./manga-loader");
const recent = require("./update-recent");

const db = require("../models");

module.exports = (server, app) => {
  const io = require("socket.io")(server);

  io.on("connection", socket => {
    console.log("connected: ", socket.id);
    FileManager.setSocket(io, socket, db);
    // mloader.setSocket(db);
    // let user = app.locals.user;
    // if (user) {
    socket.on("load-disks", FileManager.diskLoader);

    socket.on("load-content", FileManager.loadContent);

    socket.on("scan-dir", FileManager.scanDir);

    socket.on("remove-file", FileManager.removeFile);

    // socket.on('loadzip-image', (data) => mloader.loadZipImages(data, socket, user));

    // socket.on('add-or-update-recent', (data) => { recent.updateRecent(data, user) });
    // }

    socket.on("disconnect", client => {
      // mloader.removeZip(socket.id);
      console.log("disconnected: ", socket.id);
    });
  });
};
