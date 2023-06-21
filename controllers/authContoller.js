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
      if (!user) {
        return res.status(401).json({ status: 400, message: "Wrong Email!" });
      }

      const bytes = CryptoJS.AES.decrypt(
        user.password,
        process.env.CRYPTO_SECRET
      );
      const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

      if (originalPassword !== req.body.password) {
        return res
          .status(401)
          .json({ status: 400, message: "Wrong Password!" });
      }

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
      return res.status(200).json(userData);
    } catch (err) {
      console.log(err);
      const userData = {
        status: 500,
        message: "User not logged in",
      };
      return res.status(500).json(userData);
    }
  },
  logoutUser: async (req, res) => {
    console.log(req.headers.token);
    if (req.headers.token) {
      try {
        const user = await User.findOne({ token: req.headers.token });
        if (!user) {
          return res.status(401).json({ status: 400, message: "Wrong Token!" });
        }
        user.token = "";
        await user.save();
        const userData = {
          status: 200,
          message: "User logged out successfully",
        };
        return res.status(200).json(userData);
      } catch (err) {
        const userData = {
          status: 500,
          message: "User not logged out",
        };
        return res.status(500).json(userData);
      }
    }
  },
};
