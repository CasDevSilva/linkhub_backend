import { Router } from "express";
import { getLinks, createLink, updateLink, deleteLink, reorderLinks } from "../controllers/links.js";
import { verifyTokenJWT } from "../utils/auth.js";

const router = Router();

router.use(verifyTokenJWT);

router.get("/", getLinks);
router.post("/", createLink);
router.put("/reorder", reorderLinks);
router.put("/:id", updateLink);
router.delete("/:id", deleteLink);

export default router;