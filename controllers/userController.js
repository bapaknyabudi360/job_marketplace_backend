const User = require("../models/User");
const CryptoJS = require("crypto-js");

module.exports = {
  updateUser: async (req, res) => {
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.CRYPTO_SECRET
      ).toString();
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );

      const { password, __v, createdAt, updatedAt, ...others } =
        updatedUser._doc;
      res.status(200).json(others);
    } catch (err) {
      res.status(500);
    }
  },

  deleteUser: async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted");
    } catch (err) {
      res.status(500).json(err);
    }
  },

  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      const { password, __v, createdAt, updatedAt, ...userData } = user._doc;
      res.status(200).json(userData);
    } catch (err) {
      res.status(500);
    }
  },

  getAllUsers: async (req, res) => {
    const query = req.query.new;
    try {
      const users = query
        ? await User.find().sort({ _id: -1 }).limit(5)
        : await User.find();

      res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
