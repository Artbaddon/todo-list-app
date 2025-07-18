import TaskModel from "../models/task.model.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { getFileType, getFileUrl } from "../utils/file.utils.js";
import { sendTaskNotification } from "../config/views/email/emailjs.js";

dotenv.config();

class TaskController {
  async addTask(req, res) {
    try {
      // Step 1: Extract data from request body
      const {
        title,
        description,
        type,
        priority,
        color,
        startDate,
        endDate,
        notificationEmail,
        assignedTo,
        tags,
        projectId,
        createdBy,
      } = req.body;

      // Step 2: Validate required fields
      if (!title || !description || !type || !priority || !startDate || !endDate || !notificationEmail || !createdBy) {
        return res.status(400).json({ 
          error: "Required fields: title, description, type, priority, startDate, endDate, notificationEmail, createdBy" 
        });
      }

      // Step 3: Validate and convert dates
      const startDateConverted = new Date(startDate);
      const endDateConverted = new Date(endDate);
      
      if (isNaN(startDateConverted) || isNaN(endDateConverted)) {
        return res.status(400).json({ error: "Invalid date format" });
      }
      
      if (startDateConverted > endDateConverted) {
        return res.status(400).json({ error: "Start date must be before end date" });
      }

      // Step 4: Process uploaded files
      const files = [];
      
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const fileObject = {
            name: file.originalname,
            url: getFileUrl(file.filename),
            type: getFileType(file.mimetype),
            size: file.size,
            uploadedDate: new Date()
          };
          
          files.push(fileObject);
        }
        
        console.log(`Successfully processed ${files.length} files`);
      }

      // Step 5: Process assignedTo field
      const assignedToArray = assignedTo ? 
        (typeof assignedTo === 'string' ? JSON.parse(assignedTo) : assignedTo) : [];

      // Step 6: Process tags field
      const tagsArray = tags ? 
        (typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags) : [];

      // Step 7: Create new task object
      const newTask = new TaskModel({
        title,
        description,
        type,
        priority,
        color: color || "#d300ff",
        startDate: startDateConverted,
        endDate: endDateConverted,
        createdAt: new Date(),
        notificationEmail,
        assignedTo: assignedToArray,
        files: files,
        comments: [],
        tags: tagsArray,
        projectId: projectId ? new mongoose.Types.ObjectId(projectId) : null,
        createdBy: new mongoose.Types.ObjectId(createdBy),
      });

      // Step 8: Save task to database
      const savedTask = await newTask.save();
      
      // Step 9: Send notification email
      try {
        const emailResult = await sendTaskNotification(notificationEmail, {
          title,
          description,
          priority,
          type,
          startDate: startDateConverted,
          endDate: endDateConverted,
          assignedTo: assignedToArray,
          tags: tagsArray,
          files: files
        });
        
        if (emailResult.success) {
          console.log('Task notification email sent successfully');
        } else {
          console.warn('Failed to send notification email:', emailResult.error);
        }
      } catch (emailError) {
        console.warn('Email sending failed:', emailError.message);
        // Don't fail the request if email fails
      }
      
      // Step 10: Return success response
      return res.status(201).json({ 
        message: "Task created successfully",
        data: savedTask,
        filesUploaded: files.length
      });
      
    } catch (error) {
      console.error('Task creation error:', error);
      
      // Handle multer errors specifically
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: "File size too large. Maximum 10MB per file." });
      }
      
      if (error.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ error: "Too many files. Maximum 5 files allowed." });
      }
      
      return res.status(500).json({ 
        error: "Internal server error", 
        details: error.message 
      });
    }
  }

  async show(req, res) {
    try {
      const tasks = await TaskModel.find()
        .populate('createdBy', 'username email')
        .populate('assignedTo.userId', 'username email');
      
      if (!tasks || tasks.length === 0) {
        return res.status(404).json({ message: "No tasks found" });
      }
      
      return res.status(200).json({ data: tasks });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async findbyId(req, res) {
    try {
      const { id } = req.params;
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid task ID" });
      }

      const task = await TaskModel.findById(id)
        .populate('createdBy', 'username email')
        .populate('assignedTo.userId', 'username email');
      
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      
      return res.status(200).json({ data: task });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid task ID" });
      }

      const updateData = { ...req.body };
      updateData.lastModified = new Date();

      const updatedTask = await TaskModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedTask) {
        return res.status(404).json({ error: "Task not found" });
      }

      return res.status(200).json({ 
        message: "Task updated successfully",
        data: updatedTask 
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid task ID" });
      }

      const deletedTask = await TaskModel.findByIdAndDelete(id);
      
      if (!deletedTask) {
        return res.status(404).json({ error: "Task not found" });
      }

      return res.status(200).json({ 
        message: "Task deleted successfully",
        data: deletedTask 
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new TaskController();
