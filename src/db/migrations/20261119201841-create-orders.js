"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("orders", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            code: {
                type: Sequelize.UUID,
                allowNull: true,
            },
            date: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            amount: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            paid: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
            },
            customer_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: "customers",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable("orders");
    },
};