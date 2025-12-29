import { Router } from "express";
import { loginUser } from "../controllers/auth.js";
import { createUser, getUser } from "../controllers/users.js";
import { verifyTokenJWT } from "../utils/auth.js";

const authRouter = Router();

authRouter.post("/register",createUser); // done
authRouter.post("/login", loginUser); // done
authRouter.get("/me", verifyTokenJWT, getUser); // done

export default authRouter;