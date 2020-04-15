module.exports.updateConfig = async (user, data, db) => {
  // Update User Video Config
  if (user) {
    let Config = { ...user.UserConfig.Config };

    let { volume, mute, pause } = data.config;
    if (Config.video) {
      Config.video.volume = volume;
      Config.video.mute = mute;
      Config.video.pause = pause;

      await db.userConfig.update({ Config }, { where: { UserId: user.Id } });
    }
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

module.exports.updateRecentFolders = async (user, data, db) => {
  if (user) {
    let folder = await db.folder.findOne({
      attributes: [
        "Id",
        "Name",
        "Type",
        "Cover",
        [
          db.sqlze.literal(`(Select count(*) from Files where FolderId == Folders.Id)`),
          "FileCount",
        ],
      ],
      where: { Id: data.id },
    });
    console.log("User-Update:", data);
    let Config = { ...user.UserConfig.Config };
    let recentsF = [...Config.recentFolders];
    let recent = removeById(recentsF, data.id);
    // Create a recent
    console.log("updateFolder: ", recentsF.length);
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
    if (recentsF.length > 18) Config.recentFolders.shift();

    await user.UserConfig.update({
      Config: { ...Config, recentFolders: recentsF },
    });
  }
};
