module.exports = function (sequelize, DataTypes) {
    const ItemOrder = sequelize.define(
        "ItemOrder",
        {
            item_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "items",
                    key: "id",
                },
            },
            orders_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "orders",
                    key: "id",
                },
            },
        },
        {
            sequelize,
            tableName: "item_order",
            schema: "public",
            timestamps: false,
        }
    );

    ItemOrder.associate = function (models) {
        ItemOrder.belongsTo(models.Item, { foreignKey: "item_id" });
        ItemOrder.belongsTo(models.Order, { foreignKey: "orders_id" });
    };

    return ItemOrder;
};