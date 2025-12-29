import { getDBPublicProfile } from "../utils/database.js";

export const getPublicProfile = async (req, res, next) => {
    try {
        const { username } = req.params;

        const profile = await getDBPublicProfile(username);

        if (!profile) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(profile);
    } catch (error) {
        next(error);
    }
};