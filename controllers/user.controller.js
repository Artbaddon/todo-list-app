import userModel from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

class UserController {
  async addUser(req, res) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,16}$/;
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must be 8-16 characters long, contain at least one uppercase letter, one lowercase letter, and one number",
      });
    }

    try {
      const existingUser = await userModel.findOne({ 
        $or: [{ email }, { username }] 
      });
      if (existingUser) {
        const conflictField = existingUser.email === email ? 'email' : 'username';
        return res.status(409).json({ error: `User with this ${conflictField} already exists` });
      }
      
      const newUser = new userModel({ username, email, password });
      await newUser.save();
      return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      // Handle MongoDB duplicate key error
      if (error.code === 11000) {
        const duplicateField = Object.keys(error.keyPattern)[0];
        return res.status(409).json({ 
          error: `User with this ${duplicateField} already exists` 
        });
      }
      return res.status(500).json({ error: "Internal server error", details: error.message });
    }
  }
  async show(req, res) {
    try {
      const users = await userModel.find();
      if (!users) throw new Error("Error not users found");
      return res.status(200).json(users);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
  async findbyId(req, res) {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: "ID is required" });
      }
      const user = await userModel.findById({ _id: id });
      if (!user) throw new Error("User not found");
      return res.status(200).json({ data: user });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
  async update(req, res) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,16}$/;
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          error:
            "Password must be 8-16 characters long, contain at least one uppercase letter, one lowercase letter, and one number",
        });
      }
     
      // Check if another user already has this email or username (excluding current user)
      const existingUser = await userModel.findOne({ 
        $and: [
          { _id: { $ne: req.params.id } },
          { $or: [{ email }, { username }] }
        ]
      });
      
      if (existingUser) {
        const conflictField = existingUser.email === email ? 'email' : 'username';
        return res.status(400).json({ error: `User with this ${conflictField} already exists` });
      }

      const updatedUser = await userModel.findOneAndUpdate(
        { _id: req.params.id },
        { username, email, password },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      
      return res.status(200).json({ data: updatedUser });
    } catch (error) {
      // Handle MongoDB duplicate key error
      if (error.code === 11000) {
        const duplicateField = Object.keys(error.keyPattern)[0];
        return res.status(409).json({ 
          error: `User with this ${duplicateField} already exists` 
        });
      }
      return res.status(500).json({ error: "Internal server error", details: error.message });
    }
  }
  async delete(req, res) {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: "ID is required" });
      }
      const user = await userModel.findByIdAndDelete({ _id: id });
      if (!user) throw new Error("User not found");
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default new UserController();
