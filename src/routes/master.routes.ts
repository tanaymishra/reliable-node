import express from "express";
import authRoutes from "./user/auth/auth.routes";

const router = express.Router();

router.use("/auth", authRoutes);

export default router;