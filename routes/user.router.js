import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();
const name   = "/user";

router.use(verifyToken);

router.route(name)
  .post(userController.addUser)
  .get(userController.show);

router.route(`${name}/:id`)
  .get(userController.findbyId)
  .put(userController.update)
  .delete(userController.delete);

export default router;
