require("dotenv").config();
const jwt = require("jsonwebtoken");

function get_jwt(req, res, next) {
  const bearerToken = req.headers.authorization;

  if (!bearerToken) {
    return res.status(401).json({ msg: "Unauthenticated" });
  }

  if (bearerToken.split(" ").length != 2) {
    return res.status(401).json({ msg: "Invalid token" });
  }

  try {
    const token = bearerToken.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ msg: "Invalid token" });
  }
}

module.exports = get_jwt;
