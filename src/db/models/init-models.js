var DataTypes = require("sequelize").DataTypes;
var _Brand = require("./brand");
var _Customer = require("./customer");
var _ItemCategory = require("./item_category");
var _ItemOrder = require("./item_order");
var _ItemType = require("./item_type");
var _Item = require("./item");
var _Model = require("./model");
var _Order = require("./order");
var _Store = require("./store");

function initModels(sequelize) {
  var Brand = _Brand(sequelize, DataTypes);
  var Customer = _Customer(sequelize, DataTypes);
  var ItemCategory = _ItemCategory(sequelize, DataTypes);
  var ItemOrder = _ItemOrder(sequelize, DataTypes);
  var ItemType = _ItemType(sequelize, DataTypes);
  var Item = _Item(sequelize, DataTypes);
  var Model = _Model(sequelize, DataTypes);
  var Order = _Order(sequelize, DataTypes);
  var Store = _Store(sequelize, DataTypes);

  Item.belongsTo(Brand, { as: "brand", foreignKey: "brand_id"});
  Brand.hasMany(Item, { as: "items", foreignKey: "brand_id"});
  Model.belongsTo(Brand, { as: "brand", foreignKey: "brand_id"});
  Brand.hasMany(Model, { as: "models", foreignKey: "brand_id"});
  Order.belongsTo(Customer, { as: "customer", foreignKey: "customer_id"});
  Customer.hasMany(Order, { as: "orders", foreignKey: "customer_id"});
  Item.belongsTo(ItemCategory, { as: "categ", foreignKey: "categ_id"});
  ItemCategory.hasMany(Item, { as: "items", foreignKey: "categ_id"});
  Item.belongsTo(ItemType, { as: "type", foreignKey: "type_id"});
  ItemType.hasMany(Item, { as: "items", foreignKey: "type_id"});
  ItemOrder.belongsTo(Item, { as: "item", foreignKey: "item_id"});
  Item.hasMany(ItemOrder, { as: "item_orders", foreignKey: "item_id"});
  Item.belongsTo(Model, { as: "model", foreignKey: "model_id"});
  Model.hasMany(Item, { as: "items", foreignKey: "model_id"});
  ItemOrder.belongsTo(Order, { as: "order", foreignKey: "orders_id"});
  Order.hasMany(ItemOrder, { as: "item_orders", foreignKey: "orders_id"});
  Item.belongsTo(Store, { as: "store", foreignKey: "store_id"});
  Store.hasMany(Item, { as: "items", foreignKey: "store_id"});

  return {
    Brand,
    Customer,
    ItemCategory,
    ItemOrder,
    ItemType,
    Item,
    Model,
    Order,
    Store,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
