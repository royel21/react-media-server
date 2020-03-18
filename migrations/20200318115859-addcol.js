"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Favorites", "Type", {
      type: Sequelize.STRING(8),
      default: ""
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Favorites", "Type");
  }
};
