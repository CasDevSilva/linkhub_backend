import { Router } from "express";
import { createUser, getUser } from "../controllers/Users";
import { loginUser } from "../controllers/Auth";

const authRouter = Router();

authRouter.post("/register", createUser);
authRouter.post("/login", loginUser);
authRouter.get("/me", getUser);

export default authRouter;