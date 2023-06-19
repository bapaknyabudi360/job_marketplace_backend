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
      const userData = {
        status: 200,
        message: "User created successfully",
        data: user,
      };
      res.status(200).json(userData);
    } catch (err) {
      const userData = {
        status: 500,
        message: "User not created",
      };
      res.status(500).json(userData);
    }
  },

  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      !user && res.status(401).json({ status: 400, message: "Wrong Email!" });
      var bytes = CryptoJS.AES.decrypt(
        user.password,
        process.env.CRYPTO_SECRET
      );
      var originalPassword = bytes.toString(CryptoJS.enc.Utf8);
      originalPassword !== req.body.password &&
        res.status(401).json({ status: 400, message: "Wrong Password!" });
      const token = jwt.sign(
        {
          id: user._id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
          isAgent: user.isAgent,
          skills: user.skills,
          profile: user.profile,
        },
        process.env.JWT_SECRET
      );

      user.token = token;
      await user.save();

      const { password, __v, createdAt, updatedAt, ...others } = user._doc;
      const userData = {
        status: 200,
        message: "User logged in successfully",
        data: others,
      };
      res.status(200).json(userData);
    } catch (err) {
      const userData = {
        status: 500,
        message: "User not logged in",
      };
      res.status(500).json(userData);
    }
  },
};
