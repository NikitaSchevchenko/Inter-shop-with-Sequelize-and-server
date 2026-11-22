const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const Order = sequelize.define('Order', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    code: {
      type: DataTypes.UUID,
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    paid: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'customers',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'orders',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "orders_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });

  Order.associate = function(models){
    Order.belongsTo(models.Customer, {foreignKey: "customer_id"});
    Order.hasMany(models.ItemOrder, { foreignKey: "orders_id"});
    Order.belongsToMany(models.Item, {
      through: models.ItemOrder,
      foreignKey: "orders_id",
      otherKey: "item_id",
    })
  }
  return Order;
};
