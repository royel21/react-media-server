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

// const directoryInfo = require("./modules/folders");
// const db = require("./models");
// let socket = {
//   emit(event, data) {
//     console.log(event, data);
//   }
// };

// const io = {
//   sockets: socket
// };
// // directoryInfo.setSocket(io, socket, db);

// const playList = async req => {
//   let files = await db.file.findAll({ where: { FolderId: "rqk0w" } });
//   for (let f of files) {
//     await f.destroy();
//   }
// };

// db.init().then(() => {
// playList();
// console.time("start");
// directoryInfo.scanDir({ Path: "E:\\Temp\\Mangas" }).then(() => {
//   console.timeEnd("start");
// });
// const page = 1;
// const items = 12;
// const filter = "";
// db.file
//   .findAndCountAll({
//     order: [db.sqlze.literal("REPLACE(File.Name, '[','0')")],
//     attribute: ["Id", "Name", "FullPath", "ViewCount"],
//     offset: ((page || 1) - 1) * items,
//     limit: items || 12,
//     where: {
//       name: {
//         [db.Op.like]: `%${filter | ""}%`
//       }
//     }
//   })
//   .then(files => {
//     let data = {
//       files: [],
//       totalPages: files.count * items,
//       totalFiles: files.count
//     };
//     data.files = files.rows.map(f => {
//       f.dataValues;
//     });
//     // res.send(data);
//     console.log(files);
//   })
//   .catch(err => {
//     console.log(files);
//   });
// directoryInfo.scanDir({ Path: "E:\\Anime\\Knight's & Magic" });
// directoryInfo.scanDir({ Path: "E:\\Series" });
// directoryInfo.scanDir({ Path: "E:\\Anime\\Masamune-kun no Revenge" });
// const req = {
//   body: {
//     type: "folder",
//     id: "lkvha"
//   }
// };
// playList(req);
// });

// directoryInfo.diskLoader();

/********************************** */
// const winEx = require("win-explorer");
// const allExt = /(avi|avi2|mp4|mkv|ogg|webm|rar|zip)/gi;

// let filtered = winEx
//   .ListFilesRO("E:\\Anime\\3D Kanojo Real Girl")
//   .filter(f => f.isDirectory || (allExt.test(f.extension) && !f.isHidden));

// console.log(filtered);
// const { exec, execFileSync } = require("child_process");
// var ffmpeg = "ffmpeg";
// var ffprobe = "ffprobe";

// const getDuration = async video => {
//   let tempVal = execFileSync(
//     ffprobe,
//     ["-i", video, "-show_entries", "format=duration", "-v", "quiet", "-of", "csv=p=0"],
//     {
//       timeout: 1000 * 60 * 10
//     }
//   );
//   let Duration = parseFloat(tempVal);
//   console.log();

//   let pos = (Duration * 0.237).toFixed(2);
//   let cmd =
//     ffmpeg +
//     ` -ss ${pos} -i "${video}" -y -vframes 1 -q:v 0 -vf scale=240:-1 "${toPath}"`;
//   return await new Promise((resolve, reject) => {
//     exec(cmd, (err, stdout, stderr) => {
//       if (err) {
//         resolve(false);
//         return;
//       }
//       resolve(true);
//     });
//   });

// };
// const work = async () => {
//   await getDuration("E:\\Anime\\kiss x Sis\\Kiss x Sis OVA - 00.mp4");
//   await getDuration("E:\\Anime\\kiss x Sis\\Kiss x Sis OVA - 01.mp4");
//   await getDuration("E:\\Anime\\kiss x Sis\\Kiss x Sis OVA - 02.mp4");
//   await getDuration("E:\\Anime\\kiss x Sis\\Kiss x Sis OVA - 03.mp4");
//   await getDuration("E:\\Anime\\kiss x Sis\\Kiss x Sis OVA - 04.mp4");
// };
// work();
const winex = require("win-explorer");

for (let f of winex.ListFilesRO("M:\\Mangas")) {
  f.Files = [];
  if (f.isDirectory) console.log(f);
}
