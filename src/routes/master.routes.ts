import express from "express";
import authRoutes from "./user/auth/auth.routes";
import projectRoutes from "./project/project.routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/project", projectRoutes);

export default router;