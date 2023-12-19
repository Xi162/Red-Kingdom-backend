const express = require("express");
const bcrypt = require("bcrypt");

const { sequelize } = require("../../sequelize/index");
const router = express.Router();

const models = sequelize.models;

router.post("/", async (req, res) => {
  try {
    if (
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.Email ||
      !req.body.gender ||
      !req.body.DOB ||
      !req.body.password ||
      !req.body.phoneNumber
    )
      throw new Error("Bad request");
    // console.log(req.body.firstname);
    const user = models.User.findAll({
      where: {
        Email: req.body.Email,
      },
    });
    if (user.length > 0) throw new Error("Email exists");
    hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = models.User.build({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      Email: req.body.Email,
      gender: req.body.gender,
      DOB: req.body.DOB,
      password: hashedPassword,
      phoneNumber: req.body.phoneNumber,
    });
    await newUser.save();
    res.status(200).json({
      msg: "User created",
    });
  } catch (e) {
    // console.log(e);
    res.status(403).json({
      msg: e.message,
    });
  }
});

module.exports = router;
