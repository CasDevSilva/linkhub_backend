import { Router } from "express";
import { createLink, deleteLink, getLink, reorderLinks, updateLink } from "../controllers/Links";

const linksRouter = Router();

linksRouter.get("/", getLink);
linksRouter.post("/", createLink);
linksRouter.put("/:id", updateLink);
linksRouter.delete("/:id", deleteLink);
linksRouter.put("/reorder", reorderLinks);

export default linksRouter;