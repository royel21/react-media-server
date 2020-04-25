const Sequelize = require("sequelize");
const path = require("path");
var dbPath = path.join("./files.db");

const db = {};

const Op = Sequelize.Op;
const DataTypes = Sequelize.DataTypes;
const sequelize = new Sequelize("sqlite:./" + dbPath, {
  logging: false,
  // logging: console.log,
});

db.Op = Op;

db.user = require("./user")(sequelize, DataTypes);
db.file = require("./file")(sequelize, DataTypes);
db.category = require("./category")(sequelize, DataTypes);
db.folder = require("./folder")(sequelize, DataTypes);
db.favorite = require("./favorites")(sequelize, DataTypes);
db.recent = require("./recents")(sequelize, DataTypes);
db.userConfig = require("./userconfig")(sequelize, DataTypes);

db.directory = require("./directories")(sequelize, DataTypes);

db.recentFile = require("./recent-file")(sequelize, DataTypes);
db.favoriteFile = require("./favorite-file")(sequelize, DataTypes);
db.fileCategory = require("./file-category")(sequelize, DataTypes);

db.sqlze = sequelize;

db.category.belongsToMany(db.file, { through: { model: db.fileCategory } });
db.file.belongsToMany(db.category, {
  through: { model: db.fileCategory, onDelete: "cascade" },
});

db.favorite.belongsToMany(db.file, { through: { model: db.favoriteFile } });
db.file.belongsToMany(db.favorite, {
  through: { model: db.favoriteFile, onDelete: "cascade" },
});

db.recent.belongsToMany(db.file, { through: { model: db.recentFile } });
db.file.belongsToMany(db.recent, {
  through: { model: db.recentFile, onDelete: "cascade" },
});

db.directory.hasMany(db.file, { onDelete: "cascade" });
db.directory.hasMany(db.folder, { onDelete: "cascade" });

db.folder.belongsTo(db.directory);

db.file.belongsTo(db.directory);
db.file.belongsTo(db.folder);

db.user.hasMany(db.favorite, { onDelete: "cascade" });
db.user.hasOne(db.recent, { onDelete: "cascade" });
db.user.hasOne(db.userConfig, { onDelete: "cascade" });

db.folder.hasMany(db.file, { onDelete: "cascade" });

db.init = async (force) => {
  await sequelize.sync({ force });
  let admin = await db.user.findOne({ where: { Name: "Administrator" } });

  if (!admin) {
    await db.user.create(
      {
        Name: "Administrator",
        Password: "Admin",
        Role: "Administrator",
        Recent: {
          Name: "Administrator",
        },
        UserConfig: {
          Name: "Administrator",
          Config: {
            order: "nu",
            items: 0,
            recentFolders: [],
            video: { KeysMap: {}, volume: 0.3, pause: true, mute: false },
            manga: { KeysMap: {}, scaleX: 0.6, scaleY: 1, aniDuration: 300 },
          },
        },
      },
      {
        include: [db.recent, db.favorite, db.userConfig],
      }
    );
  }
};

module.exports = db;
