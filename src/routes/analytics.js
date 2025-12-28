import { Router } from "express";
import { createClick, getClicks, getDevices, getReferrers, overviewAnalytics } from "../controllers/Analytics";

const analyticRouter = Router();

analyticRouter.post("/:linkId", createClick);
analyticRouter.get("/overview", overviewAnalytics);
analyticRouter.get("/clicks", getClicks);
analyticRouter.get("/devices", getDevices);
analyticRouter.get("/referrers", getReferrers);

export default analyticRouter;