import { Router } from "express";
import { getPublicUserInformation } from "../controllers/public";

const publicRouter = Router();

publicRouter.get("", getPublicUserInformation)

export default publicRouter;