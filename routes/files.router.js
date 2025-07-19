import { Router } from "express";
import { fileController } from "../controllers/files.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();
const name = "files";
router.use(verifyToken);

router.route(`/${name}/upload`).post(fileController.uploadFile);

router.route(`/${name}`).get(fileController.getFiles);

router
  .route(`/${name}/download/:filename`)
  .get(fileController.downloadFile);

router
  .route(`/${name}/:filename`)
  .get(fileController.getFile)
  .delete(fileController.deleteFile);
 

export default router;
