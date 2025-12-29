import { Router } from "express";
import { getOverview, getClicks, getDevices, getReferrers } from "../controllers/analytics.js";
import { verifyTokenJWT } from "../utils/auth.js";

const router = Router();

router.use(verifyTokenJWT);

router.get("/overview", getOverview);
router.get("/clicks", getClicks);
router.get("/devices", getDevices);
router.get("/referrers", getReferrers);

export default router;