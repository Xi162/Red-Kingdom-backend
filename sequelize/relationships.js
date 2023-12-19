const { DataTypes } = require("sequelize");

module.exports = function setRelationships(sequelize) {
  const { User, Product, Cart, Order } = sequelize.models;
  const OrderProduct = sequelize.define("OrderProduct", {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  User.belongsToMany(Product, { through: Cart });
  Product.belongsToMany(User, { through: Cart });

  Order.belongsToMany(Product, {
    through: OrderProduct,
  });
  Product.belongsToMany(Order, {
    through: OrderProduct,
  });

  User.hasMany(Order, {
    onDelete: "CASCADE",
    allowNull: false,
  });
  Order.belongsTo(User, {
    allowNull: false,
  });
};
