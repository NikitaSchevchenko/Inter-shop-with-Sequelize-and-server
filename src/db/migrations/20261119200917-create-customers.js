"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("customers", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            name: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true,
            },
            email: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true,
            },
            password: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable("customers");
    },
};