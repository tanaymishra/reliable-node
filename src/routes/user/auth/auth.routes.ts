import signup from "../../../controllers/user/auth/signup/signup";
import express from "express";
const router = express.Router();
router.post("/signup", signup);
export default router;
