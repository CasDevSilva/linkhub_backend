import { Router } from "express";
import { trackClick } from "../controllers/track.js";

const router = Router();

router.post("/:linkId", trackClick);

export default router;