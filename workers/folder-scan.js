const WinDrive = require("win-explorer");
const { fork } = require("child_process");
const fs = require("fs-extra");
const path = require("path");
const sharp = require("sharp");
// const { NormalizeName, Capitalize } = require("../Utils/StringUtil");

const db = require("../models");

const { genScreenShot, foldersThumbNails } = require("./generate-screenshot");

const allExt = /(avi|avi2|mp4|mkv|ogg|webm|rar|zip)/gi;

//Create all Folders Needed
const coverPath = path.join("./public", "covers", "Folder");
fs.mkdirsSync(coverPath);
fs.mkdirsSync(path.resolve("./public", "covers", "Manga"));
fs.mkdirsSync(path.resolve("./public", "covers", "Video"));

var DirectoryId;

var folderCovers = [];
const createFolderAndCover = async (dir, files) => {
  if (files.length === 0) return;

  let Name = path.basename(dir);
  let FolderCover = path.join(coverPath, Name + ".jpg");

  let folder = await db.folder.findOrCreate({
    where: { Name, DirectoryId, Cover: FolderCover }
  });

  if (!fs.existsSync(FolderCover)) {
    let img = files.find(a => /jpg|jpeg|png|gif/gi.test(a.extension));

    if (img) {
      await sharp(path.join(dir, img.FileName))
        .jpeg({ quality: 75 })
        .resize({ height: 160 })
        .toFile(FolderCover);
    } else {
      let firstFile = files.filter(a => allExt.test(a.extension))[0];

      if (firstFile) {
        folderCovers.push({
          folder: true,
          filePath: path.join(dir, firstFile.FileName),
          coverPath: FolderCover,
          isManga: /rar|zip/gi.test(firstFile.FileName)
        });
      }
    }
  }
  return folder.Id;
};

var tempFiles = [];
const PopulateDB = async (folder, files, FolderId) => {
  let filteredFile = files.filter(
    f => f.isDirectory || (allExt.test(f.extension) && !f.isHidden)
  );

  for (let f of filteredFile) {
    try {
      if (!f.isDirectory) {
        let Id = Math.random()
          .toString(36)
          .slice(-5);
        let found = tempFiles.filter(v => v.Name === f.FileName);
        let vfound = await db.file.findAll({
          where: {
            [db.Op.or]: [{ Id }, { Name: f.FileName }]
          }
        });

        if (found.length === 0 && vfound.length === 0) {
          tempFiles.push({
            Id,
            Name: f.FileName,
            FullPath: folder,
            Type: /rar|zip/gi.test(f.extension) ? "Manga" : "Video",
            DirectoryId,
            FolderId,
            Size: f.Size,
            CreatedAt: f.LastModified
          });
        }
      } else {
        let fId = await createFolderAndCover(f.FileName, f.Files);
        await PopulateDB(f.FileName, f.Files, fId);
      }
    } catch (error) {
      console.log("folder-scan line:94", err);
      break;
    }
  }
  try {
    if (tempFiles.length > 0) await db.file.bulkCreate(tempFiles);
    tempFiles = [];
  } catch (err) {
    console.log("folder-scan line:102", err);
  }
};

const removeOrphanFiles = async DirId => {
  let files = await db.file.findAll({ where: { DirectoryId: DirId } });
  for (let f of files) {
    if (!fs.existsSync(path.join(f.FullPath, f.Name))) await f.destroy();
  }
};

const scanDirectory = async data => {
  await removeOrphanFiles(data.id);

  DirectoryId = data.id;

  var fis = WinDrive.ListFilesRO(data.dir);
  let folder;
  if (fis.length > 0) folder = await createFolderAndCover(data.dir, fis);

  await PopulateDB(data.dir, fis, folder);
  await foldersThumbNails(folderCovers);
  await genScreenShot(data.id);
};
const pendingJobs = [];
const processJobs = async () => {
  while (pendingJobs.length > 0) {
    try {
      let data = pendingJobs.pop();
      await scanDirectory(data);
      db.directory.update({ IsLoading: false }, { where: { Id: data.id } });
      process.send(data);
    } catch (err) {
      console.log("folder-scan line:135", err);
    }
  }
  process.exit();
};
var running = false;
process.on("message", data => {
  pendingJobs.push(data);
  if (!running) {
    running = true;
    processJobs();
  }
});
