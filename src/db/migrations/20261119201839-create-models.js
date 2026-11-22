"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("models", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            title: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true,
            },
            brand_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: "brands",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable("models");
    },
};