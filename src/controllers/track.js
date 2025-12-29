import crypto from "crypto";
import { createDBClick, getDBLinkById } from "../utils/database.js";
import { parseUserAgent } from "../utils/parseUserAgent.js";

export const trackClick = async (req, res, next) => {
    try {
        const { linkId } = req.params;

        const link = await getDBLinkById(linkId);
        if (!link) {
            return res.status(404).json({ error: "Link not found" });
        }

        const userAgent = req.headers["user-agent"] || "";
        const parsed = parseUserAgent(userAgent);

        const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.ip;
        const ipHash = crypto.createHash("sha256").update(ip).digest("hex").slice(0, 16);

        await createDBClick({
            linkId: link.id,
            userId: link.userId,
            referrer: req.headers["referer"] || null,
            userAgent,
            device: parsed.device,
            browser: parsed.browser,
            os: parsed.os,
            ipHash
        });

        res.json({ success: true });
    } catch (error) {
        next(error);
    }
};