const { fork } = require("child_process");
const drivelist = require("drivelist");
const fs = require("fs-extra");
const path = require("path");
const winEx = require("win-explorer");

var io;
var socket;
var db;

module.exports.setSocket = (_io, _socket, _db) => {
  io = _io;
  socket = _socket;
  db = _db;
};

const getNewId = () => {
  return Math.random().toString(36).slice(-5);
};

var worker = null;
const startWork = (model) => {
  if (!worker) {
    worker = fork("./workers/BackgroundScan.js");

    worker.on("message", (data) => {
      io.sockets.emit("scan-finish", data);
    });

    worker.on("exit", () => {
      worker = null;
      db.directory
        .update({ IsLoading: false }, { where: { IsLoading: true } })
        .then(() => {
          io.sockets.emit("scan-finish", { all: true });
          console.log("scan-finish");
        });
    });
  }
  let data = { id: model.Id, dir: model.FullPath };
  worker.send(data);
};

module.exports.diskLoader = () => {
  drivelist.list().then((drives) => {
    let disks = [];
    drives.forEach((drive) => {
      if (drive) {
        if (drive.mountpoints.length > 0) {
          let mp = drive.mountpoints[0].path;
          mp = mp === "/" ? "/home" : mp;
          disks.push({
            Id: getNewId(),
            Name: mp,
            Path: mp,
            Content: [],
          });
        }
      }
    });
    disks.sort((a, b) => a.Name.localeCompare(b.Name));
    socket.emit("disk-loaded", disks);
  });
};

module.exports.loadContent = (data) => {
  //If is it root of disk return;
  if (fs.existsSync(data.Path)) {
    let dirs = winEx.ListFiles(data.Path, { directory: true });
    let tdata = [];
    for (let d of dirs) {
      tdata.push({
        Id: getNewId(),
        Name: d.FileName,
        Path: path.join(data.Path, d.FileName),
        Content: [],
      });
    }
    socket.emit("content-loaded", { data: tdata, Id: data.Id });
  }
};

module.exports.scanDir = async ({ Id, Path }) => {
  //If is it root of disk return;
  if (!Id && !Path) return socket.emit("scan-info", "Id And Path both can't be null");

  let msg;
  try {
    let model;

    if (!Id) {
      let dirInfo = winEx.ListFiles(Path || "", { oneFile: true });

      if (dirInfo && !["c:\\", "C:\\", "/"].includes(Path)) {
        model = await db.directory.create({
          FullPath: Path,
          Name: dirInfo.FileName,
        });
      }
    } else {
      model = await db.directory.findOne({
        where: { Id },
      });
    }

    if (model) {
      if (model.IsLoading && worker) {
        msg = `Directory ${model.Name} is already scanning content`;
      } else {
        msg = `Directory ${model.Name} scanning content`;
        startWork(model);
      }
    } else {
      msg = "directory don't exist or can't add root of a disk";
    }
  } catch (err) {
    let error = err.errors;
    console.log(err);
    if (error) {
      msg = "Directory Already Added";
    } else {
      msg = "System error for more info verify log";
    }
  }

  socket.emit("scan-info", msg);
  console.log(msg);
};

/************Remove file */

module.exports.removeFile = async ({ Id, Del }) => {
  let file = await db.file.findByPk(Id);
  const message = { removed: false, msg: "" };
  if (file) {
    try {
      await file.destroy();
      message.removed = true;
      if (Del) {
        let cover = path.join(
          process.cwd(),
          "images",
          "covers",
          file.Type,
          file.Name + ".jpg"
        );
        fs.removeSync(cover);
        fs.removeSync(path.join(file.FullPath, file.Name));
        message.msg = `File ${file.Name} removed from server`;
      } else {
        message.msg = `File ${file.Name} removed from DB`;
      }
    } catch (err) {
      console.log(err);
      message.msg = "Server Error 500";
    }
  } else {
    message.msg = "File not found";
  }
  socket.emit("file-removed", message);
};
