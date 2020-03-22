const path = require("path");
const os = require("os");
const fs = require("fs-extra");

var ListFiles;
var ListFilesR;
var ListFilesRO;

var WinExplore = {};

if (os.platform().includes("win32")) {
  WinExplore = require("./build/Release/win_explorer");
} else if (os.platform().includes("linux")) {
  WinExplore.ListFiles = dir => {
    var foundFiles = fs.readdirSync(dir);
    var tempFiles = [];
    var i = 0;
    for (let f of foundFiles) {
      if (["$"].includes(f[0]) || f.includes("System Volume Information"))
        continue;

      let data = fs.statSync(path.join(dir, f));
      tempFiles[i] = {
        isDirectory: false,
        FileName: f,
        Size: data.size,
        isHidden: f[0] == ".",
        extension: ""
      };

      if (data.isDirectory()) {
        tempFiles[i].isDirectory = true;
      } else {
        tempFiles[i].extension = f.split(".").pop();
      }
      i++;
    }

    return tempFiles;
  };
}

sortFiles = (a, b) => {
  var a1 = a.FileName.replace(/\(/gi, "0").replace(/\[/gi, "1");
  var b1 = b.FileName.replace(/\(/gi, "0").replace(/\[/gi, "1");
  return a1.localeCompare(b1);
};

ListFiles = (dir, options) => {
  var d = path.resolve(dir);
  if ((options || {}).oneFile) return WinExplore.ListFiles(d, true)[0];

  let opts = options || {};

  var files = WinExplore.ListFiles(d, false).sort(sortFiles);

  const checkFiles = f => {
    if (f.isHidden) {
      return !opts.hidden ? false : opts.hidden;
    }

    if (opts.files) {
      return !f.isDirectory === opts.files;
    }

    if (opts.directory) {
      return opts.directory === f.isDirectory;
    }

    return true;
  };

  if (options && options.file && options.filters.length) {
    return files.filter(v => {
      if (options.filters.includes(v.extension.toLowerCase())) {
        return checkFiles(f);
      } else {
        return false;
      }
    });
  } else {
    return files.filter(checkFiles);
  }
};

ListFilesR = dir => {
  var temp = path.resolve(dir);
  var files = [];
  listAll = d => {
    let fs1 = WinExplore.ListFiles(d);
    for (f of fs1) {
      if (f.isDirectory) {
        files.push(f);
        var p = path.join(d, f.FileName);
        listAll(p);
      } else {
        files.push(f);
      }
    }
  };
  listAll(temp);
  return files;
};

ListFilesRO = dir => {
  var temp = path.resolve(dir);
  listAll = d => {
    let fs1 = WinExplore.ListFiles(d);
    let files = [];
    for (f of fs1) {
      if (f.isDirectory) {
        var f2 = {
          FileName: path.join(d, f.FileName),
          Files: listAll(path.join(d, f.FileName)),
          isDirectory: true,
          Size: 0
        };
        files.push(f2);
      } else {
        files.push(f);
      }
    }
    return files;
  };
  return listAll(temp);
};

module.exports = {
  ListFiles,
  ListFilesR,
  ListFilesRO
};
