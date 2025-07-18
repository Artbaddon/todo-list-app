import express from "express";
import {connectDB} from "../config/db/connection.js";

import authRouter from "../routes/auth.router.js";
import userRouter from "../routes/user.router.js";
import taskRouter from "../routes/task.router.js";


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api", authRouter);
app.use("/api", userRouter);
app.use('/uploads', express.static('uploads'));
app.use("/api", taskRouter);

app.use((req, res, next) => {
  res.status(404).json({ message: "End Point Not Found" });
});

export default app;