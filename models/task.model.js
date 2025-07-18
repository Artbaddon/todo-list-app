import { mongoose } from "../config/db/connection.js";
const assignSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  },

);
const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["image", "document", "video", "other"],
  },
  size: {
    type: Number,
    required: true,
  },
  uploadedDate: {
    type: Date,
    default: Date.now,
  },
});
const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    required: true,
    enum: ["High", "Medium", "Low"],
  },
  color: {
    type: String,
    default: "#ff767694",
    match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  },

  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (v) {
        return v > this.startDate;
      },
      message: "End date must be after start date",
    },
  },
  createdAt: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["Pending", "In Progress", "Completed", "On Hold"],
    default: "Pending",
  },
  notificationEmail: {
    type: String,
    required: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  assignedTo: [assignSchema],
  files: [fileSchema],
  comments: [commentSchema],
  tags: {
    type: [String],
    required: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "project",
    required: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  lastModified: {
    type: Date,
    default: Date.now,
  },
});
taskSchema.pre("save", function (next) {
  this.lastModified = new Date();
  next();
});
taskSchema.pre("updateOne", function (next) {
  this.set({ lastModified: new Date() });
  next();
});
taskSchema.index({ projectId: 1, status: 1 });
taskSchema.index({ startDate: 1, endDate: "text" });
taskSchema.index({ tags: 1 });

export default mongoose.model("task", taskSchema);
