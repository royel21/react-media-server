const folders = require("./folders");
const mloader = require("./manga-loader");
const recent = require("./update-recent");

const db = require("../models");

module.exports = (server, app) => {
  const io = require("socket.io")(server);

  io.on("connection", socket => {
    console.log("connected: ", socket.id);
    console.log(app.locals.user);
    folders.setSocket(io, socket, db);
    // mloader.setSocket(db);
    // let user = app.locals.user;
    // if (user) {
    socket.on("load-disks", folders.diskLoader);

    socket.on("load-content", folders.loadContent);

    // socket.on('re-scan', folders.reScan);

    // socket.on('loadzip-image', (data) => mloader.loadZipImages(data, socket, user));

    // socket.on('add-or-update-recent', (data) => { recent.updateRecent(data, user) });
    socket.on("test", data => {
      console.log("data:", data);
      //socket.emit("disk-loaded", "more test");
    });
    socket.emit("testing", "test");
    // }

    socket.on("disconnect", client => {
      // mloader.removeZip(socket.id);
      console.log("disconnected");
    });
  });
};
