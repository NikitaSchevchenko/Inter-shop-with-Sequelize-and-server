module.exports = function (sequelize, DataTypes) {
    const Store = sequelize.define(
        "Store",
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
                unique: "stores_title_key",
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: "stores",
            schema: "public",
            timestamps: false,
            indexes: [
                {
                    name: "stores_pkey",
                    unique: true,
                    fields: [{ name: "id" }],
                },
                {
                    name: "stores_title_key",
                    unique: true,
                    fields: [{ name: "title" }],
                },
            ],
        }
    );

    Store.associate = function (models) {
        Store.hasMany(models.Item, { foreignKey: "store_id" });
    };

    return Store;
};