const express = require("express");

const { sequelize } = require("../../sequelize/index");
const get_jwt = require("../middlewares/get_jwt");
const authorization = require("../middlewares/authorization");
const router = express.Router();

const models = sequelize.models;

router.get("/", async (req, res) => {
  const products = await models.Product.findAll({
    attributes: {
      exclude: ["description", "createdAt", "updatedAt", "size"],
    },
  });
  console.log(JSON.stringify(products, null, 4));
  res.status(200).json(products);
});

router.get("/hats", async (req, res) => {
  const products = await models.Product.findAll({
    where: {
      type: "Hat",
    },
    attributes: {
      exclude: ["description", "createdAt", "updatedAt", "size"],
    },
  });
  console.log(JSON.stringify(products, null, 4));
  res.status(200).json(products);
});

router.get("/souvenirs", async (req, res) => {
  const products = await models.Product.findAll({
    where: {
      type: "Souvenir",
    },
    attributes: {
      exclude: ["description", "createdAt", "updatedAt", "size"],
    },
  });
  console.log(JSON.stringify(products, null, 4));
  res.status(200).json(products);
});

router.get("/bags", async (req, res) => {
  const products = await models.Product.findAll({
    where: {
      type: "Bag",
    },
    attributes: {
      exclude: ["description", "createdAt", "updatedAt", "size"],
    },
  });
  console.log(JSON.stringify(products, null, 4));
  res.status(200).json(products);
});

router.get("/officials", async (req, res) => {
  const products = await models.Product.findAll({
    where: {
      type: "Official",
    },
    attributes: {
      exclude: ["description", "createdAt", "updatedAt", "size"],
    },
  });
  console.log(JSON.stringify(products, null, 4));
  res.status(200).json(products);
});

router.get("/training", async (req, res) => {
  const products = await models.Product.findAll({
    where: {
      type: "Training",
    },
    attributes: {
      exclude: ["description", "createdAt", "updatedAt", "size"],
    },
  });
  console.log(JSON.stringify(products, null, 4));
  res.status(200).json(products);
});

router.get("/:productID", async (req, res) => {
  const product = await models.Product.findByPk(req.params.productID, {
    attributes: {
      exclude: ["createdAt", "updatedAt", "size"],
    },
  });
  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).json({
      msg: "Product not found",
    });
  }
});

router.post("/", get_jwt, authorization, async (req, res) => {
  try {
    const newProduct = models.Product.build({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      type: req.body.type,
    });
    await newProduct.save();
    res.status(200).json(newProduct);
  } catch (e) {
    res.status(403).json({
      msg: e.message,
    });
  }
});

router.put("/:productID", get_jwt, authorization, async (req, res) => {
  try {
    const product = await models.Product.findByPk(req.params.productID);
    if (product) {
      product.name = req.body.name ? req.body.name : product.name;
      product.price = req.body.price ? req.body.price : product.price;
      product.description = req.body.description
        ? req.body.description
        : product.description;
      await product.save();
      res.status(200).json({ ...product, msg: "Product updated" });
    } else {
      res.status(404).json({
        msg: "Product not found",
      });
    }
  } catch (e) {
    res.status(403).json({
      msg: e.message,
    });
  }
});

router.delete("/:productID", get_jwt, authorization, async (req, res) => {
  try {
    const product = await models.Product.findByPk(req.params.productID);
    if (product) {
      await product.destroy();
      res.status(200).json({
        msg: "Product deleted",
      });
    } else {
      res.status(404).json({
        msg: "Product not found",
      });
    }
  } catch (e) {
    res.status(403).json({
      msg: e.message,
    });
  }
});

module.exports = router;
