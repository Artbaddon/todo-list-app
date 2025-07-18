import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { encryptPassword, comparePassword } from "../library/appBcrypt.js";

import dotenv from "dotenv";
dotenv.config();

class AuthController {
  async register(req, res) {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters long" });
      }
      const existingUser = await userModel.findOne({
        $or: [{ email }, { username }],
      });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      const newUser = new userModel({
        username,
        email,
        password,
      });
      await newUser.save();
      return res.status(201).json({
        message: "User registered successfully",
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
        },
      });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      const user = await userModel.findOne({ email });
      if (!user)
        return res.status(400).json({ message: "Invalid email or password" });
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Invalid email or password" });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      console.error("Error logging in user:", error);
      res.status(400).json({ message: "Internal server error" });
    }
  }
}

export default new AuthController();