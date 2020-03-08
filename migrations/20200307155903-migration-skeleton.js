module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.addColumn("Files", "ViewCount", {
                    type: Sequelize.INTEGER,
                    defaultValue: 0
                })
            ]);
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.removeColumn("Files", "ViewCount", { transaction: t })
            ]);
        });
    }
};