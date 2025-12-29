import { hashPassword } from "../utils/auth.js";
import { createDBUser, getDBUserbyID, getDBUserByUsername, getDBUserByEmail, updateDBUser, updateDBUserTheme } from "../utils/database.js";
import { validateEmail, validateUsername, validatePassword, sanitizeUser } from "../utils/validators.js";

const VALID_THEMES = ["default", "dark", "minimal", "neon"];

export const createUser = async (req, res, next) => {
    try {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            return res.status(400).json({ error: "Email, password and username required" });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        if (!validateUsername(username)) {
            return res.status(400).json({ error: "Username must be 3-20 chars, alphanumeric and underscore only" });
        }

        if (!validatePassword(password)) {
            return res.status(400).json({ error: "Password must be at least 6 characters" });
        }

        const existingEmail = await getDBUserByEmail(email);
        if (existingEmail) {
            return res.status(409).json({ error: "Email already registered" });
        }

        const existingUsername = await getDBUserByUsername(username);
        if (existingUsername) {
            return res.status(409).json({ error: "Username already taken" });
        }

        const user = await createDBUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

export const getUserByUsername = async (req, res, next) => {
    try {
        const user = await getDBUserByUsername(req.params.username);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(sanitizeUser(user));
    } catch (error) {
        next(error);
    }
};

export const getUser = async (req, res, next) => {
    try {
        const user = await getDBUserbyID(req.user.id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(sanitizeUser(user));
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const forbidden = ["id", "username", "email", "createdAt", "updatedAt"];
        const hasForbidden = forbidden.some(f => req.body[f] !== undefined);

        if (hasForbidden) {
            return res.status(400).json({ error: "Cannot modify id, username, email or timestamps" });
        }

        if (req.body.password) {
            if (!validatePassword(req.body.password)) {
                return res.status(400).json({ error: "Password must be at least 6 characters" });
            }
            req.body.password = await hashPassword(req.body.password);
        }

        if (req.body.theme && !VALID_THEMES.includes(req.body.theme)) {
            return res.status(400).json({ error: `Theme must be one of: ${VALID_THEMES.join(", ")}` });
        }

        const user = await updateDBUser(req.user.id, req.body);
        res.json({ message: "Profile updated", user: sanitizeUser(user) });
    } catch (error) {
        next(error);
    }
};

export const updateTheme = async (req, res, next) => {
    try {
        const { theme } = req.body;

        if (!theme) {
            return res.status(400).json({ error: "Theme required" });
        }

        if (!VALID_THEMES.includes(theme)) {
            return res.status(400).json({ error: `Theme must be one of: ${VALID_THEMES.join(", ")}` });
        }

        const user = await updateDBUserTheme(req.user.id, theme);
        res.json({ message: "Theme updated", user });
    } catch (error) {
        next(error);
    }
};