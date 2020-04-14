module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define(
    "File",
    {
      Id: {
        type: DataTypes.STRING(10),
        primaryKey: true,
        unique: true,
        allowNull: false
      },
      Name: {
        type: DataTypes.STRING(150)
      },
      Duration: {
        type: DataTypes.FLOAT(8, 2).UNSIGNED,
        defaultValue: 0
      },
      FullPath: {
        type: DataTypes.STRING,
        defaultValue: "",
        allowNull: false
      },
      Type: {
        type: DataTypes.STRING(25),
        defaultValue: "",
        allowNull: false
      },
      Size: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      CreatedAt: {
        type: DataTypes.DATE
      },
      ViewCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      Cover: {
        type: DataTypes.STRING
      }
    },
    {
      timestamps: false,
      hooks: {
        beforeValidate: function(item, options) {
          item.Id = Math.random()
            .toString(36)
            .slice(-5);
          item.Cover = `/covers/${item.Type}/${item.Name.replace(/#|%/gi, "")}.jpg`;
        },
        beforeBulkCreate(instances, options) {
          for (var item of instances) {
            item.Cover = `/covers/${item.Type}/${item.Name.replace(/#|%/gi, "")}.jpg`;
          }
        }
      }
    }
  );

  File.findByName = name => {
    return File.findOne({
      where: {
        Name: name
      }
    });
  };

  return File;
};
