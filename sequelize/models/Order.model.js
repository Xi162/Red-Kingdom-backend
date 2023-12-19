const { DataTypes, Sequelize } = require("sequelize");

module.exports = async (sequelize) => {
  const Order = sequelize.define(
    "Order",
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      receiver_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      orderDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      deliverDate: {
        type: DataTypes.DATE,
      },
      status: {
        type: DataTypes.ENUM("delivered", "pending", "cancelled"),
        allowNull: false,
        defaultValue: "pending",
      },
      paymentMethod: {
        type: DataTypes.ENUM("Cash", "Banking"),
        allowNull: false,
        defaultValue: "Cash",
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      totalPrice: {
        type: DataTypes.FLOAT,
      },
    },
    {
      validate: {
        isLaterThanOrderDate() {
          if (this.deliverDate) {
            if (Date(this.deliverDate) < Date(this.orderDate)) {
              throw new Error("Deliver date must be later than order date");
            }
          }
        },
      },
    }
  );
};
