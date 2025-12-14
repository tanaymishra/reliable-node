import signup from "../../../controllers/user/auth/signup/signup";
import login from "../../../controllers/user/auth/login/login";
import googleAuth from "../../../controllers/user/auth/google/google";
import express from "express";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleAuth);

export default router;
