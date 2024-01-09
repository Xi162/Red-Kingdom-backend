const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const { User, Product } = sequelize.models;
  const Cart = sequelize.define(
    "Cart",
    {
      UserID: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        unique: false,
        references: {
          model: User,
          key: "id",
        },
      },
      ProductID: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        unique: false,
        references: {
          model: Product,
          key: "id",
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      size: {
        type: DataTypes.ENUM("O", "S", "M", "L", "XL"),
        allowNull: false,
        defaultValue: "O",
        primaryKey: true,
        unique: false,
      },
    },
    {
      timestamps: false,
    }
  );
};
