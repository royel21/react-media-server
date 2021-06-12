var db;
module.exports.setDb = (_db) => {
  db = _db;
};

module.exports.updateFileView = async (data) => {
  let file = db.file.findByPk(data.id);
  if (file) {
    await file.update({ ViewCount: file.ViewCount + 1 });
  }
};

module.exports.updateFilePos = async (data, user) => {
  // console.log("file-update", data, user && user.Name);
  let recent = await db.recentFile.findOrCreate({
    where: { FileId: data.id, RecentId: user.Recent.Id },
  });
  await recent[0].update({ LastRead: new Date(), LastPos: data.pos || 0 });
};

module.exports.updateConfig = async (data, user) => {
  let Config = { ...user.UserConfig.Config };

  let { volume, mute, pause } = data.config;
  if (Config.video) {
    Config.video.volume = volume;
    Config.video.mute = mute;
    Config.video.pause = pause;

    await db.userConfig.update({ Config }, { where: { UserId: user.Id } });
  }
};

const removeById = function (arr, Id) {
  var i = arr.length;
  while (i--) {
    if (arr[i] instanceof Object && arr[i].Id == Id) {
      return arr.splice(i, 1)[0];
    }
  }
};

module.exports.updateRecentFolders = async (data, user) => {
  let folder = await db.folder.findOne({
    attributes: ["Id", "Name", "Type", "Cover", "FileCount"],
    where: { Id: data.id },
  });

  if (!folder) return;

  let Config = { ...user.UserConfig.Config };
  let recentsF = [...Config.recentFolders];
  let recent = removeById(recentsF, data.id);
  // Create a recent
  if (!recent) {
    recent = {
      ...folder.dataValues,
      FileId: data.fileId,
    };
  } else {
    //Update old recent
    recent.FileId = data.fileId;
  }
  recentsF.unshift(recent);
  //Remove if over 50
  if (recentsF.length > 18) recentsF.pop();

  await user.UserConfig.update({
    Config: { ...Config, recentFolders: recentsF },
  });
};
