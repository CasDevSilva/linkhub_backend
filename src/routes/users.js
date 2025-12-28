import { Router } from "express";
import { getUserByUsername, updateTheme, updateUser } from "../controllers/Users";

const userRouter = Router();

userRouter.get("/:username", getUserByUsername);
userRouter.put("/profile", updateUser);
userRouter.put("/theme", updateTheme);

export default userRouter;