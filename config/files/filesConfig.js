import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import e from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOAD_DIR = path.join(__dirname, "../../uploads");

export const getFilesPath = () => UPLOAD_DIR;

const ensureUploadDirExists = async () => {
  try {
    fs.accessSync(UPLOAD_DIR);
  } catch (error) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      ensureUploadDirExists();
      cb(null, UPLOAD_DIR);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const sanitizedName = file.originalname
      .replace(/[^a-z0-9.]/gi, "_")
      .toLowerCase();
    cb(null, `${uniqueSuffix}-${sanitizedName}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "text/plain",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
    return;
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter,
});

export const getFilePath = (filename) => {
  return path.join(UPLOAD_DIR, filename);
};

export const fileExists = async (filename) => {
  try {
    await fs.promises.access(getFilePath(filename));
    return true;
  } catch (error) {
    return false;
  }
};
