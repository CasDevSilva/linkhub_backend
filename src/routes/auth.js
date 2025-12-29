import { Router } from "express";
import { createUser, getUser } from "../controllers/users.js";
import { loginUser } from "../controllers/auth.js";

const authRouter = Router();

authRouter.post("/register", createUser);
authRouter.post("/login", loginUser);
authRouter.get("/me", getUser);

export default authRouter;