import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/auth/register", verifyToken, authController.register);
router.post("/auth/login", authController.login);

export default router;
