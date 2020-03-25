module.exports = (sequelize, DataTypes) => {
  const Directory = sequelize.define(
    "Directory",
    {
      Id: {
        type: DataTypes.STRING(20),
        unique: true,
        primaryKey: true,
        allowNull: false
      },
      Name: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false
      },
      FullPath: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      IsLoading: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      hooks: {
        beforeValidate(item, options) {
          item.Id = Math.random()
            .toString(36)
            .slice(-5);
        }
      },
      timestamps: false
    }
  );

  return Directory;
};
