import express from "express";
import create from "../../controllers/project/create/create";
import getAll from "../../controllers/project/get/getAll";
import { authMiddleware } from "../../middlewares/middleware";

const router = express.Router();

// Apply auth middleware to all project routes
router.use(authMiddleware(["company-admin"]));

router.post("/create", create);
router.get("/all", getAll);

export default router;
