const { exec, execFileSync } = require("child_process");
const db = require("../models");
const path = require("path");
const fs = require("fs-extra");
const thumbnails = require("./thumbsnail");

var ffmpeg = "ffmpeg";
var ffprobe = "ffprobe";

var vCover = path.resolve("./images");

const getVideoDuration = async (vPath) => {
  try {
    let tempVal = execFileSync(
      ffprobe,
      [
        "-i",
        vPath,
        "-show_entries",
        "format=duration",
        "-v",
        "quiet",
        "-of",
        "csv=p=0",
      ],
      {
        timeout: 1000 * 60 * 10,
      }
    );

    return !isNaN(tempVal) && parseFloat(tempVal);
  } catch (err) {
    console.log("Err:", err);
    return false;
  }
};

const getScreenShot = async (video, toPath, duration) => {
  let pos = (duration * 0.237).toFixed(2);
  let cmd =
    ffmpeg +
    ` -ss ${pos} -i "${video}" -y -vframes 1 -q:v 0 -vf scale=240:-1 "${toPath}"`;
  return await new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        resolve(false);
        return;
      }
      resolve(true);
    });
  });
};

module.exports.genScreenShot = async (id) => {
  let files = await db.file.findAll({
    where: { DirectoryId: id, Duration: 0 },
  });
  console.log("Creating Thumbnails");
  for (let f of files) {
    let coverPath = path.join(vCover, f.Cover);

    let exist = fs.existsSync(coverPath);
    if (exist && f.Duration > 0) continue;

    let fullPath = path.join(f.FullPath, f.Name);

    if (f.Type.includes("Manga")) {
      if (/zip/gi.test(f.Name)) {
        let total = await thumbnails.ZipCover(fullPath, coverPath, exist);
        await f.update({ Duration: total });
      } else if (/rar/gi.test(f.filePath)) {
        await thumbnails.RarCover(fullPath, coverPath);
      }
    } else {
      try {
        let Duration = await getVideoDuration(fullPath);
        if (Duration && f.Duration === 0) {
          await f.update({ Duration });
        }

        if (!exist) await getScreenShot(fullPath, coverPath, Duration);
      } catch (err) {
        console.log("some-video-error", err);
      }
    }
  }
};

module.exports.foldersThumbNails = async (folders) => {
  for (let s of folders) {
    try {
      if (!s.isManga) {
        let duration = getVideoDuration(s.filePath);
        if (isNaN(duration)) continue;
        await getScreenShot(s.filePath, s.coverPath, duration);
      } else {
        if (/zip/gi.test(s.filePath)) {
          await thumbnails.ZipCover(s.filePath, s.coverPath);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
};
