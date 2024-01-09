require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { sequelize } = require("../../sequelize/index");
const router = express.Router();

const models = sequelize.models;

router.post("/", async (req, res) => {
  // find the user with the email in the DB
  const user = await models.User.findAll({
    where: {
      Email: req.body.email,
    },
  });
  // if the email does not exist in the DB, tell the user
  if (user.length <= 0) {
    return res.status(401).json({
      msg: "Incorrect Email",
      token: null,
    });
  }
  // if we can find a result, check the compare passwords
  result = await bcrypt.compare(req.body.password, user[0].password);
  if (result) {
    const token = jwt.sign(
      {
        userID: user[0].id,
        isAdmin: user[0].isAdmin,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({
      msg: "Login successfully",
      userID: user[0].id,
      isAdmin: user[0].isAdmin,
      token: token,
    });
  } else {
    res.status(401).json({
      msg: "Incorrect password",
      token: null,
    });
  }
});

module.exports = router;
