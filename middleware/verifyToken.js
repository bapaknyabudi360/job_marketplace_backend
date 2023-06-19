const User = require("../models/User");
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) res.status(403).json("Token is not valid!");
      req.user = user;
      console.log("req.user", user);
      next();
    });
  } else {
    return res
      .status(401)
      .json({ status: 401, message: "You are not authenticated!" });
  }
};

const verifyTokenAndAuthorization = async (req, res, next) => {
  await verifyToken(req, res, () => {
    if (req.user.id === req.params.id) {
      next();
    } else {
      res
        .status(403)
        .json({ status: 403, message: "You are not allowed to do that!" });
    }
  });
};

const verifyTokenAndAdmin = async (req, res, next) => {
  await verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res
        .status(403)
        .json({ status: 403, message: "You are not allowed to do that!" });
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
