const { DataTypes, Sequelize } = require("sequelize");

module.exports = async (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      gender: DataTypes.ENUM("Male", "Female"),
      DOB: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: DataTypes.STRING,
      phoneNumber: {
        type: DataTypes.STRING,
        validate: {
          is: /^(?:\+\d{1,3}\s?)?(?:\(\d{1,}\))?(?:[-.\s]?)?\d{1,}[-.\s]?\d{1,}[-.\s]?\d{1,}$/,
        },
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      timestamps: false,
    }
  );
};
