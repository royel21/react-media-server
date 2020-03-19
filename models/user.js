"use strict";

const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      Id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      Name: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false
      },
      Password: {
        type: DataTypes.STRING(32),
        allowNull: false
      },
      Role: {
        type: DataTypes.STRING(20),
        defaultValue: "User",
        allowNull: false
      },
      State: {
        type: DataTypes.STRING(12),
        defaultValue: "Activo",
        allowNull: false
      },
      AdultPass: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      CreatedAt: {
        type: DataTypes.DATE
      }
    },
    {
      timestamps: false,
      hooks: {
        beforeCreate: (user, options) => {
          user.Password = bcrypt.hashSync(user.Password, bcrypt.genSaltSync(8), null);
          user.CreatedAt = new Date();
          if (user.Role === "User") {
            user.Favorites = [
              {
                Name: "Manga",
                Type: "Manga"
              },
              {
                Name: "Video",
                Type: "Video"
              }
            ];
          }
        },
        beforeUpdate: (user, options) => {
          if (user.Password) {
            user.Password = bcrypt.hashSync(user.Password, bcrypt.genSaltSync(8), null);
          }
        },
        beforeBulkCreate: (users, options) => {
          for (var user of users) {
            user.Password = bcrypt.hashSync(user.Password, bcrypt.genSaltSync(8), null);
            user.CreatedAt = new Date();
            if (user.Role === "User") {
              user.Favorites = [
                {
                  Name: "Manga",
                  Type: "Manga"
                },
                {
                  Name: "Video",
                  Type: "Video"
                }
              ];
            }
          }
        }
      }
    }
  );

  User.prototype.validPassword = function(password) {
    return new Promise((resolve, rejected) => {
      bcrypt.compare(password, this.Password, (err, result) => {
        if (err) rejected(err);
        resolve(result);
      });
    });
  };
  return User;
};
