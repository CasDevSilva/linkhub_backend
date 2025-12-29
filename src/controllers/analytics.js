import { getDBClicksOverview, getDBClicksTimeline, getDBClicksByDevice, getDBClicksByReferrer } from "../utils/database.js";

export const getOverview = async (req, res, next) => {
    try {
        const overview = await getDBClicksOverview(req.user.id);
        res.json(overview);
    } catch (error) {
        next(error);
    }
};

export const getClicks = async (req, res, next) => {
    try {
        const days = parseInt(req.query.days) || 7;
        const timeline = await getDBClicksTimeline(req.user.id, days);
        res.json({ timeline });
    } catch (error) {
        next(error);
    }
};

export const getDevices = async (req, res, next) => {
    try {
        const devices = await getDBClicksByDevice(req.user.id);
        res.json({ devices });
    } catch (error) {
        next(error);
    }
};

export const getReferrers = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const referrers = await getDBClicksByReferrer(req.user.id, limit);
        res.json({ referrers });
    } catch (error) {
        next(error);
    }
};