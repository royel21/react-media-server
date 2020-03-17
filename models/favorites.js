module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define(
    "Favorite",
    {
      Id: {
        type: DataTypes.STRING(10),
        primaryKey: true,
        unique: true,
        allowNull: false
      },
      Name: {
        type: DataTypes.STRING(100),
        unique: {
          args: true,
          msg: "Duplicate name no allowed"
        },
        allowNull: false
      }
    },
    {
      timestamps: false,
      hooks: {
        beforeValidate: function(item, options) {
          item.Id = Math.random()
            .toString(36)
            .slice(-5);
        },
        beforeBulkCreate: (instances, options) => {
          for (var item of instances) {
            item.Id = Math.random()
              .toString(36)
              .slice(-5);
          }
        }
      }
    }
  );

  return Favorite;
};
