import { Router } from "express";
import { createLink, deleteLink, getLink, reorderLinks, updateLink } from "../controllers/links.js";
import { verifyTokenJWT } from "../utils/auth.js";

const linksRouter = Router();

linksRouter.get("/", verifyTokenJWT, getLink); // done
linksRouter.post("/", verifyTokenJWT,createLink); // done
linksRouter.put("/:id", verifyTokenJWT,updateLink); // done
linksRouter.delete("/:id", verifyTokenJWT, deleteLink);// done
linksRouter.put("/reorder", verifyTokenJWT, reorderLinks);

export default linksRouter;