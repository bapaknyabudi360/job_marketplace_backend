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

      const { password, __v, createdAt, ...others } = updatedUser._doc;
      const userData = {
        status: 200,
        message: "User updated successfully",
        data: others,
      };
      res.status(200).json(userData);
    } catch (err) {
      const userData = {
        status: 500,
        message: "User not updated",
      };
      res.status(500).json(userData);
    }
  },

  deleteUser: async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      const userData = {
        status: 200,
        message: "User deleted successfully",
      };
      res.status(200).json(userData);
    } catch (err) {
      const userData = {
        status: 500,
        message: "User not deleted",
      };
      res.status(500).json(userData);
    }
  },

  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      const { password, __v, createdAt, updatedAt, ...others } = user._doc;
      const userData = {
        status: 200,
        message: "User retrieved successfully",
        data: others,
      };
      res.status(200).json(userData);
    } catch (err) {
      const userData = {
        status: 500,
        message: "User not retrieved",
      };
      res.status(500).json(userData);
    }
  },

  getAllUsers: async (req, res) => {
    const query = req.query.new;
    try {
      const users = query
        ? await User.find().sort({ _id: -1 }).limit(5)
        : await User.find();
      const userData = {
        status: 200,
        message: "Users retrieved successfully",
        data: users,
      };
      res.status(200).json(userData);
    } catch (err) {
      const userData = {
        status: 500,
        message: "Users not retrieved",
      };
      res.status(500).json(userData);
    }
  },
};
