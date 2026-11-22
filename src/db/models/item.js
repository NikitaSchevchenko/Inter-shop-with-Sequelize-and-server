const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const Item = sequelize.define('Item', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    categ_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'item_categories',
        key: 'id'
      }
    },
    type_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'item_types',
        key: 'id'
      }
    },
    brand_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'brands',
        key: 'id'
      }
    },
    model_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'models',
        key: 'id'
      }
    },
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'stores',
        key: 'id'
      }
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'items',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "items_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });

  Item.associate = function(models){
    Item.belongsTo(models.Brand, { foreignKey: "brand_id"});
    Item.belongsTo(models.ItemCategory, { foreignKey: "categ_id"});
    Item.belongsTo(models.ItemType, { foreignKey: "type_id"});
    Item.hasMany(models.ItemOrder, {  foreignKey: "item_id"});
    Item.belongsTo(models.Model, { foreignKey: "model_id"});
    Item.belongsTo(models.Store, { foreignKey: "store_id"});
    Item.belongsToMany(models.Order , {
      through : models.ItemOrder,
      foreignKey: "item_id",
      otherKey : "orders_id"
    });
  }

  return Item;
};
