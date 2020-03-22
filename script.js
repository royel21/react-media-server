// const db = require("./models");

// const setDb = async () => {
//   // let dirs = await db.directory.findAll();
//   // for (let d of dirs) {
//   //   await d.update({ IsLoading: false });
//   // }
//   // console.log("loading");
//   await db.directory.update(
//     { IsLoading: false },
//     { where: { IsLoading: true } }
//   );
// };
// setDb();

/********************************** */

const directoryInfo = require("./modules/folders");
const db = require("./models");
let socket = {
  emit(event, data) {
    console.log(event, data);
  }
};

const io = {
  sockets: socket
};

db.init(true).then(() => {
  directoryInfo.setSocket(io, socket, db);

  directoryInfo.scanDir({ Path: "E:\\Temp\\Mangas" }).then(result => {
    console.log(result);
  });

  directoryInfo.scanDir({ Path: "E:\\Anime\\3D Kanojo Real Girl" }).then(result => {
    console.log(result);
  });
});

/********************************** */
// const winEx = require("win-explorer");
// const allExt = /(avi|avi2|mp4|mkv|ogg|webm|rar|zip)/gi;

// let filtered = winEx
//   .ListFilesRO("E:\\Anime\\3D Kanojo Real Girl")
//   .filter(f => f.isDirectory || (allExt.test(f.extension) && !f.isHidden));

// console.log(filtered);
