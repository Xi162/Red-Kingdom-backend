const express = require("express");

const app = express();

const { initModels, sequelize } = require("./sequelize/index");

const productRouter = require("./api/routes/products");
const signupRouter = require("./api/routes/signup");
const cartRouter = require("./api/routes/cart");
const orderRouter = require("./api/routes/orders");
const loginRouter = require("./api/routes/login");

initModels();

//Prevent CORS And Allow PUT,POST,DELETE,PATCH,GET
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"),
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, PATCH, GET");
    return res.status(200).json({});
  }
  next();
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/products", productRouter);
app.use("/signup", signupRouter);
app.use("/cart", cartRouter);
app.use("/orders", orderRouter);
app.use("/login", loginRouter);

app.get("/", (req, res) => {
  res.json({
    msg: "Hello World",
  });
});

module.exports = app;
