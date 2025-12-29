import { Router } from "express";
import { getUserByUsername, updateTheme, updateUser } from "../controllers/users.js";
import { verifyTokenJWT } from "../utils/auth.js";

const userRouter = Router();

userRouter.get("/:username", getUserByUsername); // done
userRouter.put("/profile", verifyTokenJWT, updateUser); // done
userRouter.put("/theme", verifyTokenJWT, updateTheme); // done

export default userRouter;