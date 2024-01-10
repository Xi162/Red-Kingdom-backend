module.exports = function authenticate(req, res, next) {
  if (req.user.userID !== req.params.userID) {
    // console.log(req.user.userID, req.params.userID);
    return res.status(401).json({
      msg: "Unauthenticated",
    });
  } else next();
};
