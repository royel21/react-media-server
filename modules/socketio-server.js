const FileManager = require("./file-manager");
const userUpdate = require("./user-update");
const mloader = require("./manga-loader");

const db = require("../models");

module.exports = (server, sessionMeddle) => {
  const io = require("socket.io")(server, { serveClient: false, cookie: true });
  io.use(function (socket, next) {
    sessionMeddle(socket.request, {}, next);
  });

  io.on("connection", async (socket) => {
    let isAuth = socket.request.session.passport;
    if (isAuth) {
      const user = await db.user.findOne({
        where: { Name: isAuth.user },
        include: [{ model: db.userConfig }, { model: db.recent }],
      });
      if (!user) return;
      console.log("connected", socket.id);
      FileManager.setSocket(io, socket, db);
      userUpdate.setDb(db);
      mloader.setDb(db);

      if (user.Role.includes("Administrator")) {
        socket.on("load-disks", FileManager.diskLoader);
        socket.on("load-content", FileManager.loadContent);
        socket.on("scan-dir", FileManager.scanDir);
        socket.on("remove-file", FileManager.removeFile);
      } else {
        // socket.on("file-update-view", FileManager.updateFileView);
        socket.on("file-update-pos", (data) => {
          userUpdate.updateFilePos(data, user);
        });
        socket.on("update-recentf", (data) => {
          userUpdate.updateRecentFolders(data, user);
        });
        socket.on("video-config", (data) => {
          userUpdate.updateConfig(data, user);
        });

        socket.on("loadzip-image", (data) => {
          console.log("load-image");
          mloader.loadZipImages(data, socket);
        });
        socket.on("message", (data) => console.log(data));
      }

      socket.on("disconnect", () => {
        mloader.removeZip(socket.id);
        console.log("disconnected: ", socket.id);
      });
    }
  });
};
