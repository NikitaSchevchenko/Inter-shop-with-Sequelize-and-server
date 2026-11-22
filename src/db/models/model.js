module.exports = function (sequelize, DataTypes) {
    const Model = sequelize.define(
        "Model",
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
                unique: "models_title_key",
            },
            brand_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "brands",
                    key: "id",
                },
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: "models",
            schema: "public",
            timestamps: false,
            indexes: [
                {
                    name: "models_pkey",
                    unique: true,
                    fields: [{ name: "id" }],
                },
                {
                    name: "models_title_key",
                    unique: true,
                    fields: [{ name: "title" }],
                },
            ],
        }
    );

    Model.associate = function (models) {
        Model.belongsTo(models.Brand, { foreignKey: "brand_id" });
        Model.hasMany(models.Item, { foreignKey: "model_id" });
    };

    return Model;
};