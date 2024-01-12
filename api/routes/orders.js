const express = require("express");

const { sequelize } = require("../../sequelize/index");
const get_jwt = require("../middlewares/get_jwt");
const authenticate = require("../middlewares/authenticate");
const authorization = require("../middlewares/authorization");
const router = express.Router();

const models = sequelize.models;

router.get("/", get_jwt, authorization, async (req, res) => {
  try {
    const orders = await models.Order.findAll();
    let resultOrders = [];
    for (let i = 0; i < orders.length; i++) {
      let products = await orders[i].getProducts({
        through: {
          attributes: ["quantity"],
        },
      });
      // restructure the object
      products = products.map((product) => {
        let quantity = product.OrderProduct.quantity;
        let { OrderProduct, ...productInfo } = product.get();
        return {
          ...productInfo,
          quantity: quantity,
        };
      });
      resultOrders.push({
        ...orders[i].get(),
        products: products,
      });
    }
    console.log(JSON.stringify(resultOrders, null, 2));
    res.status(200).json(resultOrders);
  } catch (e) {
    console.log(e);
    res.status(403).json({
      msg: e.message,
    });
  }
});

router.get("/user/:userID", get_jwt, authenticate, async (req, res) => {
  const userID = req.params.userID;
  try {
    const user = await models.User.findByPk(userID);
    if (!user) throw new Error("No user found");

    let orders = await user.getOrders();
    let resultOrders = [];
    //console.log(JSON.stringify(orders, null, 2));
    console.log(JSON.stringify(orders, null, 2));
    res.status(200).json(orders);
  } catch (e) {
    console.log(e);
    res.status(403).json({
      msg: e.message,
    });
  }
});

router.get("/:orderID", get_jwt, async (req, res) => {
  const orderID = req.params.orderID;
  try {
    let order = await models.Order.findOne({
      where: {
        id: orderID,
      },
    });
    if (order === null) throw new Error("No order found");
    console.log(req.user.isAdmin);
    if (!req.user.isAdmin && req.user.userID !== order.UserId)
      throw new Error("Unauthenticated");
    let products = await order.getProducts({
      attributes: ["id", "name", "price"],
      through: {
        attributes: ["quantity", "size"],
      },
    });
    console.log(JSON.stringify(products, null, 2));
    // restructure the object
    products = products.map((product) => {
      let quantity = product.OrderProduct.quantity;
      let size = product.OrderProduct.size;
      let { OrderProduct, ...productInfo } = product.get();
      return {
        ...productInfo,
        quantity: quantity,
        size: size,
      };
    });
    let resultOrder = {
      ...order.get(),
      products: products,
    };
    console.log(JSON.stringify(resultOrder, null, 2));
    res.status(200).json(resultOrder);
  } catch (e) {
    console.log(e);
    res.status(403).json({
      msg: e.message,
    });
  }
});

router.post("/user/:userID", get_jwt, authenticate, async (req, res) => {
  const userID = req.params.userID;
  try {
    console.log(req.body);
    if (!req.body.receiver_name || !req.body.address || !req.body.paymentMethod)
      throw new Error("Bad request");
    // get items from cart
    const user = await models.User.findByPk(userID);
    if (!user) throw new Error("No user found");
    const items = await user.getProducts({
      attributes: ["id", "name", "price"],
    });
    if (items.length === 0) throw new Error("No item");

    //console.log(JSON.stringify(items, null, 2));

    let totalPrice = items.reduce((accumulator, item) => {
      return accumulator + item.price * item.Cart.quantity;
    }, 0);

    // create an order
    const newOrder = models.Order.build({
      receiver_name: req.body.receiver_name,
      address: req.body.address,
      paymentMethod: req.body.paymentMethod,
      UserId: userID,
      totalPrice: totalPrice,
    });
    await newOrder.save();

    // add products from cart to order
    items.forEach(async (item) => {
      await models.OrderProduct.create({
        OrderID: newOrder.id,
        ProductID: item.id,
        quantity: item.Cart.quantity,
        size: item.Cart.size,
      });
    });

    //empty cart
    await models.Cart.destroy({
      where: {
        UserID: userID,
      },
    });

    //return the order
    console.log(JSON.stringify(newOrder, null, 2));
    res.status(200).json(newOrder);
  } catch (e) {
    if (e.message == "Bad request") {
      res.status(400).json({
        msg: "Bad request",
      });
    } else if (e.message == "No item") {
      res.status(403).json({
        msg: "No item to checkout",
      });
    } else if (e.message == "No user found") {
      res.status(400).json({
        msg: e.message,
      });
    } else {
      console.log(e);
      res.status(403).json({
        msg: "Can not create order",
      });
    }
  }
});

router.put("/:orderID", get_jwt, authorization, async (req, res) => {
  const orderID = req.params.orderID;
  try {
    const order = await models.Order.findByPk(orderID);
    if (order) {
      order.receiver_name = req.body.receiver_name
        ? req.body.receiver_name
        : order.receiver_name;
      order.address = req.body.address ? req.body.address : order.address;
      order.paymentMethod = req.body.paymentMethod
        ? req.body.paymentMethod
        : order.paymentMethod;
      order.status = req.body.status ? req.body.status : order.status;
      order.deliverDate =
        order.status !== "cancelled" && req.body.deliverDate
          ? new Date(req.body.deliverDate).toDateString()
          : order.deliverDate;
      await order.save();
      res.status(200).json({ ...order, msg: "Order updated" });
    } else {
      res.status(404).json({
        msg: "Order not found",
      });
    }
  } catch (e) {
    res.status(403).json({
      msg: e.message,
    });
  }
});

module.exports = router;
