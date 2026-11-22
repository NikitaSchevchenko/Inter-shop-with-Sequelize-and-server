module.exports = function (sequelize, DataTypes) {
    const ItemCategory = sequelize.define(
        "ItemCategory",
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
                unique: "item_categories_title_key",
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: "item_categories",
            schema: "public",
            timestamps: false,
            indexes: [
                {
                    name: "item_categories_pkey",
                    unique: true,
                    fields: [{ name: "id" }],
                },
                {
                    name: "item_categories_title_key",
                    unique: true,
                    fields: [{ name: "title" }],
                },
            ],
        }
    );

    ItemCategory.associate = function (models) {
        ItemCategory.hasMany(models.Item, { foreignKey: "categ_id" });
    };

    return ItemCategory;
};