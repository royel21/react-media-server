const { exec, execFileSync } = require("child_process");
const db = require("../models");
const path = require("path");
const fs = require("fs-extra");
const thumbnails = require("../modules/thumbsnail");

var ffmpeg = "ffmpeg";
var ffprobe = "ffprobe";

var vCover = path.resolve("./public", "covers");

const getScreenShot = async (video, toPath) => {
  let Duration = 0;
  try {
    let tempVal = execFileSync(
      ffprobe,
      ["-i", video, "-show_entries", "format=duration", "-v", "quiet", "-of", "csv=p=0"],
      {
        timeout: 1000 * 60
      }
    );

    if (isNaN(tempVal)) return;
    Duration = parseFloat(tempVal);
    if (f.Duration === 0) {
      await f.update({ Duration });
    }
  } catch (err) {
    console.log("Err:", err);
    return;
  }

  let pos = (Duration * 0.237).toFixed(2);
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

module.exports.genScreenShot = async id => {
  let files = await db.file.findAll({
    where: { DirectoryId: id, Duration: 0 }
  });
  for (let f of files) {
    let coverPath = path.join(vCover, f.Type, f.Name + ".jpg");

    if (fs.existsSync(coverPath) && f.Duration < 1) continue;

    let fullPath = path.join(f.FullPath, f.Name);

    if (f.Type.includes("Manga")) {
      if (/zip/gi.test(f.Name)) {
        let total = await thumbnails.ZipCover(fullPath, coverPath);
        await f.update({ Duration: total });
      } else if (/rar/gi.test(f.filePath)) {
        await thumbnails.RarCover(fullPath, coverPath);
      }
    } else {
      try {
        await getScreenShot(fullPath, coverPath);
      } catch (err) {
        console.log("some-video-error", err);
      }
    }
  }
};

module.exports.foldersThumbNails = async folders => {
  for (let s of folders) {
    try {
      if (!s.isManga) {
        let duration = await getVideoDuration(s.filePath);
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
