const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = function (sequelize, DataTypes) {
  const Customer = sequelize.define(
    "Customer",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: "customers_name_key",
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: "customers_email_key",
        validate : {
          isEmail: {
            msg: "Invalid email format"
          }
        }
      },
      password: {
        type: DataTypes.STRING(),
        allowNull: false,
        
        validate: {
          notEmpty: {
            msg: "Password can't be empty"
          }
        },

        set(value){
          if(!value){
            this.setDataValue("password", value);
            return;
          }
          const hash = bcrypt.hashSync(value, 10);
          this.setDataValue("password", hash)
        }
      }
    },
    {
      sequelize,
      tableName: "customers",
      schema: "public",
      timestamps: false,
      indexes: [
        {
          name: "customers_email_key",
          unique: true,
          fields: [{ name: "email" }],
        },
        {
          name: "customers_name_key",
          unique: true,
          fields: [{ name: "name" }],
        },
        {
          name: "customers_pkey",
          unique: true,
          fields: [{ name: "id" }],
        },
      ],
    },
  );

  Customer.associate = function (models) {
    Customer.hasMany(models.Order, { foreignKey: "customer_id" });
  };

  return Customer;
};
