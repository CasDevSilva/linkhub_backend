import { Router } from "express";
import { getPublicUserInformation } from "../controllers/public.js";

const publicRouter = Router();

publicRouter.get("", getPublicUserInformation)

export default publicRouter;