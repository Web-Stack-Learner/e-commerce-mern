const express = require("express");
const router = express.Router();
const User = require("../models/User");
const md5 = require("md5");
const jwt = require("jsonwebtoken");

router
  .route("/user")
  .get((req, res) => {
    res.send("Hello USer");
  })
  .post(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please Fill The Form" });
    }
    try {
      const userExist = await User.findOne({ email: email });
      if (userExist) {
        res.status(400).json({ message: "User Already Exist, Maybe LogIn!" });
      }
      const newUser = new User({
        username,
        email,
        password,
      });
      const result = await newUser.save();
      if (result) {
        res.status(200).json({ success: "User Created" });
      }
    } catch (e) {
      res.status(500).json({ message: "Server Side Error" });
    }
  });

router.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = md5(req.body.password);
  try {
    if (!username || !password) {
      return res.status(400).json({ message: "Invalid Credential" });
    }
    const user = await User.findOne({ username: username });
    const db_pass = user.password;
    password !== db_pass &&
      res.status(200).json({ message: "Invalid Credential" });

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "3d" }
    );
    res.status(200).json({ message: "Login Successfull", token: accessToken });
  } catch (e) {}
});

module.exports = router;
