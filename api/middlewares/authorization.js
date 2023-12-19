module.exports = function authorize(req, res, next) {
  if (!req.user.isAdmin) {
    return res.status(401).json({
      msg: "Unauthorized",
    });
  } else next();
};
