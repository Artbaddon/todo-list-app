import { Router } from "express";
import taskController from "../controllers/task.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { uploadTaskFiles } from "../middleware/fileUpload.middleware.js";

const router = Router();
const name = "/task";

router.use(verifyToken);

router.route(name)
  .post(uploadTaskFiles, taskController.addTask) // Add upload middleware
  .get(taskController.show);

router.route(`${name}/:id`)
  .get(taskController.findbyId)
  .put(uploadTaskFiles, taskController.update)
  .delete(taskController.delete);

export default router;