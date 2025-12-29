import { Router } from "express";
import { loginUser } from "../controllers/auth.js";
import { createUser, getUser } from "../controllers/users.js";
import { verifyTokenJWT } from "../utils/auth.js";

const router = Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/me", verifyTokenJWT, getUser);

export default router;