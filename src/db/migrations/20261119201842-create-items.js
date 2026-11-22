"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("items", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            categ_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: "item_categories",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            },
            type_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: "item_types",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
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
            model_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: "models",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            },
            store_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: "stores",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            },
            price: {
                type: Sequelize.DECIMAL,
                allowNull: false,
            },
            amount: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable("items");
    },
};