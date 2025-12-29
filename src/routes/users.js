import { Router } from "express";
import { getUserByUsername, updateTheme, updateUser } from "../controllers/users.js";
import { verifyTokenJWT } from "../utils/auth.js";

const router = Router();

router.put("/profile", verifyTokenJWT, updateUser);
router.put("/theme", verifyTokenJWT, updateTheme);
router.get("/:username", getUserByUsername);

export default router;