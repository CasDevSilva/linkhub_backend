import { createDBLink, deleteDBLink, getDBLinks, getDBLinkById, updateDBLink, reorderDBLinks } from "../utils/database.js";
import { validateUrl } from "../utils/validators.js";

export const getLinks = async (req, res, next) => {
    try {
        const links = await getDBLinks(req.user.id);
        res.json({ links });
    } catch (error) {
        next(error);
    }
};

export const createLink = async (req, res, next) => {
    try {
        const { title, url } = req.body;

        if (!title || !url) {
            return res.status(400).json({ error: "Title and URL required" });
        }

        if (!validateUrl(url)) {
            return res.status(400).json({ error: "Invalid URL format" });
        }

        const link = await createDBLink({
            ...req.body,
            userId: req.user.id
        });

        res.status(201).json(link);
    } catch (error) {
        next(error);
    }
};

export const updateLink = async (req, res, next) => {
    try {
        const { id } = req.params;

        const existing = await getDBLinkById(id);
        if (!existing) {
            return res.status(404).json({ error: "Link not found" });
        }

        if (existing.userId !== req.user.id) {
            return res.status(403).json({ error: "Not authorized" });
        }

        if (req.body.url && !validateUrl(req.body.url)) {
            return res.status(400).json({ error: "Invalid URL format" });
        }

        const forbidden = ["id", "userId", "createdAt"];
        forbidden.forEach(f => delete req.body[f]);

        const link = await updateDBLink(req.user.id, id, req.body);
        res.json(link);
    } catch (error) {
        next(error);
    }
};

export const deleteLink = async (req, res, next) => {
    try {
        const { id } = req.params;

        const existing = await getDBLinkById(id);
        if (!existing) {
            return res.status(404).json({ error: "Link not found" });
        }

        if (existing.userId !== req.user.id) {
            return res.status(403).json({ error: "Not authorized" });
        }

        await deleteDBLink(req.user.id, id);
        res.json({ message: "Link deleted" });
    } catch (error) {
        next(error);
    }
};

export const reorderLinks = async (req, res, next) => {
    try {
        const { orderedIds } = req.body;

        if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
            return res.status(400).json({ error: "orderedIds array required" });
        }

        const links = await reorderDBLinks(req.user.id, orderedIds);
        res.json({ message: "Links reordered", links });
    } catch (error) {
        next(error);
    }
};