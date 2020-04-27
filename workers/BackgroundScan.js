const WinDrive = require("win-explorer");
const fs = require("fs-extra");
const path = require("path");
const sharp = require("sharp");
// const { NormalizeName, Capitalize } = require("../Utils/StringUtil");

const db = require("../models");

const { genScreenShot, foldersThumbNails } = require("./generate-screenshot");

const allExt = /.(avi|avi2|mp4|mkv|ogg|webm|rar|zip)/i;

//Create all Folders Needed
const coverPath = path.join("./images", "covers", "Folder");
fs.mkdirsSync(coverPath);
fs.mkdirsSync(path.resolve("./images", "covers", "Manga"));
fs.mkdirsSync(path.resolve("./images", "covers", "Video"));

var DirectoryId;

var folderCovers = [];

const createFolderAndCover = async (dir, files, fd) => {
  let firstFile = files.find((a) => allExt.test(a.FileName));
  if (!firstFile) return "";
  let Name = path.basename(dir);
  let FolderCover = path.join(coverPath, Name + ".jpg");
  if (!fs.existsSync(FolderCover)) {
    let img = files.find((a) => /\.(jpg|jpeg|png|gif|webp)/i.test(a.FileName));
    if (img) {
      try {
        await sharp(path.join(dir, img.FileName))
          .jpeg({ quality: 75 })
          .resize({ height: 160 })
          .toFile(FolderCover);
      } catch (err) {
        console.log("sharp error:", err, img.FileName);
      }
    } else {
      if (firstFile) {
        folderCovers.push({
          folder: true,
          filePath: path.join(dir, firstFile.FileName),
          coverPath: FolderCover,
          isManga: /rar|zip/gi.test(firstFile.FileName),
        });
      }
    }
  }
  //Create Folder
  let folder = await db.folder.findOne({ where: { Name } });

  let FileCount = files.filter((f) => allExt.test(f.FileName)).length;
  if (!folder) {
    let CreatedAt = fd.LastModified;
    folder = await db.folder.create({
      Name,
      DirectoryId,
      Cover: FolderCover,
      CreatedAt,
      FileCount,
    });
  }

  return folder.Id;
};

var tempFiles = [];
const PopulateDB = async (folder, files, FolderId) => {
  let filteredFile = files.filter(
    (f) => f.isDirectory || (allExt.test(f.FileName) && !f.isHidden)
  );
  for (let f of filteredFile) {
    try {
      if (!f.isDirectory) {
        let Id = Math.random().toString(36).slice(-5);
        let found = tempFiles.filter((v) => v.Name === f.FileName);
        let vfound = await db.file.findAll({
          where: {
            [db.Op.or]: [{ Id }, { Name: f.FileName }],
          },
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
            CreatedAt: f.LastModified,
          });
        }
      } else {
        if (f.Files.length > 0) {
          let fId = await createFolderAndCover(f.FileName, f.Files, f);
          if (fId) {
            await PopulateDB(f.FileName, f.Files, fId);
          }
        }
      }
    } catch (error) {
      console.log("folder-scan line:104", error);
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

const removeOrphanFiles = async (DirId) => {
  let files = await db.file.findAll({ where: { DirectoryId: DirId } });
  for (let f of files) {
    if (!fs.existsSync(path.join(f.FullPath, f.Name))) await f.destroy();
  }
};

const scanDirectory = async (data) => {
  await removeOrphanFiles(data.id);

  DirectoryId = data.id;

  var fis = WinDrive.ListFilesRO(data.dir);
  let folderId;

  if (fis.filter((f) => !f.isDirectory).length > 0) {
    folderId = await createFolderAndCover(data.dir, fis);
  }
  try {
    await PopulateDB(data.dir, fis, folderId);
    console.log("job db end: ", data.id);
    await foldersThumbNails(folderCovers);
    console.log("job folder end:", data.id);
    await genScreenShot(data.id);
    console.log("job screenshot end: ", data.id);
  } catch (err) {
    console.log("line 14:", err);
  }
};

const pendingJobs = [];
const processJobs = async () => {
  while (pendingJobs.length > 0) {
    try {
      let data = pendingJobs.pop();
      await scanDirectory(data);
      await db.directory.update(
        { IsLoading: false },
        { where: { Id: data.id } }
      );
      process.send(data);
    } catch (err) {
      console.log("folder-scan line:135", err);
    }
  }
  process.exit();
};
var running = false;
process.on("message", (data) => {
  pendingJobs.push(data);
  db.directory.update({ IsLoading: true }, { where: { Id: data.id } });
  if (!running) {
    running = true;
    processJobs();
  }
});
