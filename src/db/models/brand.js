const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const Brand = sequelize.define('Brand', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "brands_title_key"
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'brands',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "brands_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "brands_title_key",
        unique: true,
        fields: [
          { name: "title" },
        ]
      },
    ]
  });

  Brand.associate = function (models) {
    Brand.hasMany(models.Item, { foreignKey: "brand_id" });
    Brand.hasMany(models.Model, { foreignKey: "brand_id" });
  }

  return Brand;
};
