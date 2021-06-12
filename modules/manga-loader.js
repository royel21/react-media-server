const StreamZip = require("node-stream-zip");
const path = require("path");
const fs = require("fs-extra");
var db;
var users = {};
const iUser = { lastId: "" };

module.exports.removeZip = (id) => {
  delete users[id];
};

module.exports.setDb = (_db) => {
  db = _db;
};

module.exports.loadZipImages = async (data, socket) => {
  let { Id, fromPage, toPage } = data;
  //get last user or create
  console.log("data;", data);
  if (!users[socket.id]) {
    users[socket.id] = iUser;
  }

  let user = users[socket.id];

  if (user.lastId === Id) {
    if (data.range) {
      for (let i of data.range) {
        let entry = user.entries[i];
        if (entry) {
          try {
            socket.emit("image-loaded", {
              page: i,
              img: user.zip.entryDataSync(entry).toString("base64"),
            });
          } catch (err) {
            console.log(err);
          }
        }
      }
    } else {
      let totalPage = fromPage + toPage;
      let size = user.entries.length;

      for (let i = fromPage < 0 ? 0 : fromPage; i < totalPage && i < size; i++) {
        let entry = user.entries[i];
        if (entry) {
          try {
            socket.emit("image-loaded", {
              page: i,
              img: user.zip.entryDataSync(entry).toString("base64"),
            });
          } catch (err) {
            console.log(err);
          }
        }
      }
    }
    socket.emit("m-finish", { last: true });
  } else {
    let file = await db.file.findOne({
      attributes: ["FullPath", "Name"],
      where: { Id },
    });
    if (file) {
      user.lastId = Id;
      let filePath = path.resolve(file.FullPath, file.Name);
      if (fs.existsSync(filePath)) {
        console.log("newZip");
        user.zip = new StreamZip({
          file: path.resolve(file.FullPath, file.Name),
          storeEntries: true,
        });

        user.zip.on("ready", () => {
          let entries = Object.values(user.zip.entries())
            .sort((a, b) => {
              return String(a.name).localeCompare(String(b.name));
            })
            .filter((entry) => {
              return !entry.isDirectory;
            });

          user.entries = entries;

          let totalPage = fromPage + toPage;

          for (
            let i = fromPage < 0 ? 0 : fromPage;
            i < totalPage && i < entries.length;
            i++
          ) {
            socket.emit("image-loaded", {
              page: i,
              img: user.zip.entryDataSync(entries[i]).toString("base64"),
            });
          }
          socket.emit("m-finish", { last: true });
        });

        user.zip.on("error", (err) => {
          socket.emit("image-loaded", { error: "some error" });
          console.log(err);
        });
      } else {
        socket.emit("manga-error", { error: "File Not Found" });
      }
    }
  }
};
