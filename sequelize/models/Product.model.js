const { DataTypes } = require("sequelize");

module.exports = async (sequelize) => {
  const Product = sequelize.define(
    "Product",
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      description: DataTypes.TEXT,
      type: {
        type: DataTypes.ENUM("Souvenir", "Bag", "Hat", "Official", "Training"),
        allowNull: false,
      },
      size: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: false,
    }
  );
};
