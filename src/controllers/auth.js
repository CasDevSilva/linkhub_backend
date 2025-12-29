import { generateJWT, samePassword } from "../utils/auth.js";
import { getDBUserByUsername } from "../utils/database.js";
import { sanitizeUser } from "../utils/validators.js";

export const loginUser = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password required" });
        }

        const user = await getDBUserByUsername(username);

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const isValid = await samePassword(password, user.password);

        if (!isValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = generateJWT({
            id: user.id,
            email: user.email,
            username: user.username
        });

        res.json({
            message: "Login successful",
            token,
            user: sanitizeUser(user)
        });
    } catch (error) {
        next(error);
    }
};