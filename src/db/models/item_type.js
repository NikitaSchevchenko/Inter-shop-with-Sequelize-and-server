module.exports = function (sequelize, DataTypes) {
    const ItemType = sequelize.define(
        "ItemType",
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            title: {
                type: DataTypes.STRING(50),
                allowNull: false,
                unique: "item_types_title_key",
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: "item_types",
            schema: "public",
            timestamps: false,
            indexes: [
                {
                    name: "item_types_pkey",
                    unique: true,
                    fields: [{ name: "id" }],
                },
                {
                    name: "item_types_title_key",
                    unique: true,
                    fields: [{ name: "title" }],
                },
            ],
        }
    );

    ItemType.associate = function (models) {
        ItemType.hasMany(models.Item, { foreignKey: "type_id" });
    };

    return ItemType;
};