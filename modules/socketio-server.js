const FileManager = require("./file-manager");
const userUpdate = require("./user-update");

const db = require("../models");

module.exports = (server, app) => {
  const io = require("socket.io")(server);

  io.on("connection", socket => {
    console.log("connected: ", socket.id);
    FileManager.setSocket(io, socket, db);
    // mloader.setSocket(db);
    var user = app.locals.user;
    // if (user) {
    socket.on("load-disks", FileManager.diskLoader);

    socket.on("load-content", FileManager.loadContent);

    socket.on("scan-dir", FileManager.scanDir);

    socket.on("remove-file", FileManager.removeFile);
    socket.on("file-update-view", FileManager.updateFileView);
    socket.on("file-update-pos", data => FileManager.updateFilePos(user, data));
    socket.on("update-recentf", data => {
      userUpdate.updateRecentFolders(user, data, db);
    });
    socket.on("video-config", data => {
      userUpdate.updateConfig(user, data, db);
    });
    // socket.on('loadzip-image', (data) => mloader.loadZipImages(data, socket, user));

    // socket.on('add-or-update-recent', (data) => { recent.updateRecent(data, user) });
    // }

    socket.on("disconnect", client => {
      // mloader.removeZip(socket.id);
      console.log("disconnected: ", socket.id);
    });
  });
};
