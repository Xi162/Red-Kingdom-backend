const { DataTypes } = require("sequelize");

module.exports = function setRelationships(sequelize) {
  const { User, Product, Cart, Order, Article } = sequelize.models;
  const OrderProduct = sequelize.define("OrderProduct", {
    OrderID: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: Order,
        key: "id",
      },
    },
    ProductID: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: Product,
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    size: {
      type: DataTypes.ENUM("O", "S", "M", "L", "XL"),
      allowNull: false,
      defaultValue: "O",
      primaryKey: true,
    },
  });

  const ArticleBlock = sequelize.define(
    "ArticleBlock",
    {
      ArticleID: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: Article,
          key: "id",
        },
      },
      BlockID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      type: {
        type: DataTypes.ENUM("text", "image", "subtitle"),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  User.belongsToMany(Product, {
    through: {
      model: Cart,
      unique: false,
    },
    foreignKey: "UserID",
  });
  Product.belongsToMany(User, {
    through: {
      model: Cart,
      unique: false,
    },
    foreignKey: "ProductID",
  });

  Order.belongsToMany(Product, {
    through: {
      model: OrderProduct,
      unique: false,
    },
    foreignKey: "OrderID",
  });
  Product.belongsToMany(Order, {
    through: {
      model: OrderProduct,
      unique: false,
    },
    foreignKey: "ProductID",
  });

  User.hasMany(Order, {
    onDelete: "CASCADE",
    allowNull: false,
  });
  Order.belongsTo(User, {
    allowNull: false,
  });

  Article.hasMany(ArticleBlock, {
    foreignKey: "ArticleID",
    onDelete: "CASCADE",
    allowNull: false,
  });
  ArticleBlock.belongsTo(Article, {
    foreignKey: "ArticleID",
    allowNull: false,
  });
  Article.belongsTo(User, {
    onDelete: "CASCADE",
    allowNull: false,
  });
  User.hasMany(Article, {
    allowNull: false,
  });
};
