const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

module.exports = {
  createUser: async (req, res) => {
    var encrypted = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.CRYPTO_SECRET
    ).toString();
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: encrypted,
    });
    try {
      const user = await newUser.save();
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      !user && res.status(401).json("Wrong Email!");
      var bytes = CryptoJS.AES.decrypt(
        user.password,
        process.env.CRYPTO_SECRET
      );
      var originalPassword = bytes.toString(CryptoJS.enc.Utf8);
      originalPassword !== req.body.password &&
        res.status(401).json("Wrong Password!");
      const token = jwt.sign({ user: user }, process.env.JWT_SECRET);

      user.token = token;
      await user.save();

      const { password, __v, createdAt, updatedAt, ...others } = user._doc;
      res.status(200).json(others);
    } catch (err) {
      res.status(500);
    }
  },
};
