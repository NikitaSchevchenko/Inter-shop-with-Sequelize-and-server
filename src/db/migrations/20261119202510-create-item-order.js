"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("item_order", {
            item_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: "items",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            orders_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: "orders",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable("item_order");
    },
};