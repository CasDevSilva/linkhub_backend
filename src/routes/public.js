import { Router } from "express";
import { getPublicProfile } from "../controllers/public.js";

const router = Router();

router.get("", getPublicProfile);

export default router;