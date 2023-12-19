const express = require("express");

const { sequelize } = require("../../sequelize/index");
const get_jwt = require("../middlewares/get_jwt");
const authenticate = require("../middlewares/authenticate");
const router = express.Router();

const models = sequelize.models;

router.get("/:userID", get_jwt, authenticate, async (req, res) => {
  const userID = req.params.userID;
  try {
    const user = await models.User.findByPk(userID);
    if (!user) throw new Error("No user found");
    let cart = await user.getProducts({
      attributes: ["id", "name", "price"],
    });
    cart = cart.map((item) => {
      let quantity = item.Cart.quantity;
      let { Cart, ...productInfo } = item.get();
      return {
        ...productInfo,
        quantity: quantity,
      };
    });
    console.log(JSON.stringify(cart, null, 2));
    res.status(200).json(cart);
  } catch (e) {
    console.log(e);
    if (e.message == "Bad request") {
      res.status(400).json({
        msg: e.message,
      });
    } else if (e.message == "No user found") {
      res.status(400).json({
        msg: e.message,
      });
    } else {
      res.status(403).json({
        msg: "Can not add to cart",
      });
    }
  }
});

router.post("/:userID", get_jwt, authenticate, async (req, res) => {
  const userID = req.params.userID;
  const productID = req.body.productID;
  try {
    if (!productID) throw new Error("Bad request");
    const user = await models.User.findByPk(userID);
    if (!user) throw new Error("No user found");
    let item = await models.Cart.findOne({
      where: {
        UserId: userID,
        ProductId: productID,
      },
    });
    // if item is already in cart, increment its quantity
    if (item !== null) await item.increment("quantity");
    // if item is not in cart, add it into cart
    else await user.addProduct(productID);
    //test
    const items = await user.getProducts({
      attributes: ["id", "name", "price"],
    });
    console.log(JSON.stringify(items, null, 2));
    res.status(200).json(items);
  } catch (e) {
    console.log(e);
    if (e.message == "Bad request") {
      res.status(400).json({
        msg: e.message,
      });
    } else {
      res.status(403).json({
        msg: "Can not add to cart",
      });
    }
  }
});

router.delete("/:userID", get_jwt, authenticate, async (req, res) => {
  const userID = req.params.userID;
  const productID = req.body.productID;
  try {
    if (!productID) throw new Error("Bad request");
    const user = await models.User.findByPk(userID);
    if (!user) throw new Error("No user found");
    let item = await models.Cart.findOne({
      where: {
        UserId: userID,
        ProductId: productID,
      },
    });
    // if item is already in cart, increment its quantity
    if (item !== null) {
      await item.decrement("quantity");
      await item.reload();
      if (item.quantity === 0) await item.destroy();
    }
    // if item is not in cart, add it into cart
    //test
    const items = await user.getProducts({
      attributes: ["id", "name", "price"],
    });
    console.log(JSON.stringify(items, null, 2));
    res.status(200).json(items);
  } catch (e) {
    console.log(e);
    if (e.message == "Bad request") {
      res.status(400).json({
        msg: e.message,
      });
    } else {
      res.status(403).json({
        msg: "Can not add to cart",
      });
    }
  }
});

module.exports = router;
