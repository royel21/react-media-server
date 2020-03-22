const { fork } = require("child_process");
const drivelist = require("drivelist");
const fs = require("fs-extra");
const path = require("path");
const winEx = require("win-explorer");

var io;
var socket;
var db;

const getNewId = () => {
  return Math.random()
    .toString(36)
    .slice(-5);
};
var worker;
const startWork = model => {
  if (!worker) worker = fork("./workers/folder-scan.js");
  let data = { id: model.Id, dir: model.FullPath };
  worker.send(data);

  worker.on("message", data => {
    io.sockets.emit("scan-finish", data);
  });

  worker.on("exit", () => {
    worker = null;
    db.directory.update({ IsLoading: false }, { where: { IsLoading: true } }).then(() => {
      io.sockets.emit("scan-finish", { all: true });
      console.log("scan-finish");
    });
  });
};

module.exports.setSocket = (_io, _socket, _db) => {
  io = _io;
  socket = _socket;
  db = _db;
};

module.exports.diskLoader = client => {
  drivelist.list().then(drives => {
    let disks = [];
    drives.forEach(drive => {
      if (drive) {
        if (drive.mountpoints.length > 0)
          disks.push({
            Id: getNewId(),
            Name: drive.mountpoints[0].path,
            Path: drive.mountpoints[0].path,
            Content: []
          });
      }
    });
    disks.sort((a, b) => a.Name.localeCompare(b.Name));
    socket.emit("disk-loaded", disks);
  });
};

module.exports.loadContent = data => {
  //If is it root of disk return;
  if (fs.existsSync(data.Path)) {
    let dirs = winEx.ListFiles(data.Path, { directory: true });
    let tdata = [];
    for (let d of dirs) {
      tdata.push({
        Id: getNewId(),
        Name: d.FileName,
        Path: path.join(data.Path, d.FileName),
        Content: []
      });
    }
    socket.emit("content-loaded", { data: tdata, Id: data.Id });
  }
};

module.exports.scanDir = async ({ Id, Path }) => {
  //If is it root of disk return;
  if (["c:\\", "C:\\", "/"].includes(Path))
    return socket && socket.emit("scan-error", "can't scan system disk");

  let dirInfo = winEx.ListFiles(Path, { oneFile: true });
  if (dirInfo) {
    try {
      let model;
      if (Id === undefined) {
        model = await db.directory.create({
          FullPath: Path,
          Name: dirInfo.FileName
        });
      } else {
        model = await db.directory.findOne({
          where: {
            [db.Op.or]: {
              Id,
              FullPath: Path
            }
          }
        });
      }

      if (model.IsLoading) {
        socket.emit("dir-added", {
          msg: `Folder ${model.Name} is already scanning content`
        });
      } else {
        socket.emit("dir-added", {
          msg: `Folder ${model.Name} Added and scanning content`
        });
        startWork(model);
      }
    } catch (err) {
      console.log(err);
      let error = err.errors[0];
      if (error) {
        socket.emit("scan-error", {
          msg: error.message
        });
      }
    }
  }
};
