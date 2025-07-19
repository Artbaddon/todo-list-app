import path from "path";
import {
  upload,
  getFilePath,
  fileExists,
  getFilesPath,
} from "../config/files/filesConfig.js";
import fs from "fs";

export const fileController = {
  uploadFile: [
    upload.single("file"),
    async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ error: "No file uploaded" });
        }

        const filePath = getFilePath(req.file.filename);
        return res.status(200).json({
          message: "File uploaded successfully",
          file: {
            name: req.file.originalname,
            originalName: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype,
            url: filePath,
            extension: path.extname(req.file.originalname),
            uploadAt: new Date(),
          },
        });
      } catch (error) {
        console.error("Error uploading file:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    },
  ],
  getFiles: async (req, res) => {
    try {
      const filesPath = getFilesPath();
      if (!fs.existsSync(filesPath)) {
        return res.status(404).json({ error: "Files directory not found" });
      }
      const fileStats = fs.readdirSync(filesPath);
      if (fileStats.length === 0) {
        return res.status(200).json({ files: [] });
      }

      const files = fileStats.map((file) => {
        const filePath = path.join(filesPath, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          originalName: file,
          size: stats.size,
          createdAt: stats.ctime,
          uploadAt: stats.mtime,
          mimetype: path.extname(file).substring(1),
          extension: path.extname(file).toLocaleLowerCase(),
          url: getFilePath(file),
        };
      });

      return res.status(200).json({ files });
    } catch (error) {
      console.error("Error retrieving files:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  getFile: async (req, res) => {
    try {
      const { filename } = req.params;

      if (!(await fileExists(filename))) {
        return res.status(404).json({ error: "File not found" });
      }
      const filePath = getFilePath(filename);
      const fileStats = fs.statSync(filePath);

      res.json({
        name: filename,
        originalName: filename,
        size: fileStats.size,
        createdAt: fileStats.ctime,
        uploadAt: fileStats.mtime,
        mimetype: path.extname(filename).substring(1),
        extension: path.extname(filename).toLocaleLowerCase(),
        url: filePath,
      });
    } catch (error) {
      console.error("Error retrieving file:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  deleteFile: async (req, res) => {
    try {
      const { filename } = req.params;

      if (!await fileExists(filename)) {
        return res.status(404).json({ error: "File not found" });
      }

      const filePath = getFilePath(filename);
      await fs.unlinkSync(filePath);

      res.json({
        message: "File deleted successfully",
        filename
      });
    } catch (error) {
      console.error("Error deleting file:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  downloadFile: async (req, res) => {
    try {
      const { filename } = req.params;

      if (!await fileExists(filename)) {
        return res.status(404).json({ error: "File not found" });
      }

      const filePath = getFilePath(filename);
      res.download(filePath, filename, (err) => {
        if (err) {
          console.error("Error downloading file:", err);
          return res.status(500).json({ error: "Internal server error" });
        }
      });
    } catch (error) {
      console.error("Error downloading file:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};
