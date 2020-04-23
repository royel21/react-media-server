const StreamZip = require("node-stream-zip");
const sharp = require("sharp");

const images = /jpg|jpeg|png|gif|webp/i;

// module.exports.RarCover = (file, coverP) => {
//     let rar = new rcunrar(file);
//     var list = rar.ListFiles().sort((a, b) => {
//         return String(a.Name).localeCompare(String(b.Name));
//     });

//     var firstImg = list.find(e => {
//         return images.includes(e.Extension.toLocaleLowerCase()) && e.Size > 1024 *
//             30
//     });

//     if (firstImg == undefined) return false;

//     var data = rar.ExtractFile(firstImg);
//     return new Promise((resolve, reject) => {
//         sharp(data).resize(240).jpeg({
//             quality: 80
//         }).toFile(coverP, (error) => {
//             resolve(coverP);
//         });
//     });
// }
var buff;
module.exports.ZipCover = (file, coverP, exist) => {
  var zip = new StreamZip({
    file,
    storeEntries: true,
  });
  return new Promise((resolve, reject) => {
    zip.on("ready", () => {
      var entries = Object.values(zip.entries())
        .sort((a, b) => {
          return String(a.name).localeCompare(String(b.name));
        })
        .filter((entry) => {
          return !entry.isDirectory;
        });

      var firstImg = entries.find((e) => {
        return images.test(e.name.split(".").pop()) && e.size > 1024 * 30;
      });

      if (exist) return resolve(entries.length);

      if (firstImg === undefined) {
        resolve(0);
        zip.close();
      } else {
        buff = zip.entryDataSync(firstImg);
        try {
          sharp(buff)
            .jpeg({
              quality: 80,
            })
            .resize(240)
            .toFile(coverP, () => {
              resolve(entries.length);
              zip.close();
              buff = [];
            });
        } catch (err) {
          console.log(err);
          resolve(0);
        }
      }
    });
    zip.on("error", (error) => {
      console.log(file, error);
      zip.close();
      resolve(0);
    });
  });
};
