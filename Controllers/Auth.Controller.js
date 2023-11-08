const createError = require("http-errors");
const User = require("../Models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  register: async (req, res, next) => {
    try {
      let user = await User.findOne({ email: req.body.email });
      console.log(user);

      if (user) {
        return res.status(400).json({ message: "user with that email exists" });
      }

      user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      });

      await user.save();

      const payload = {
        id: user._id,
      };

      const token = await jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: 3600,
      });

      return res
        .status(201)
        .set({ token: token })
        .json({ message: "account created" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "its not you its us" });
    }
  },
  login: async (req, res, next) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "unauthorized" });
      }

      const matchPasswords = await bcrypt.compare(password, user.password);

      if (!matchPasswords) {
        return res.status(400).json({ message: "unauthorized" });
      }

      const token = jwt.sign(
        {
          id: user._id,
        },
        process.env.SECRET_KEY,
        { expiresIn: 3600 }
      );

      return res
        .status(200)
        .set({ token: token })
        .json({ message: "logged in" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "its not you its us" });
    }
  },
};
