import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import "dotenv/config";

const SALT_ROUNDS = 10;

export const hashPassword = async (password) => {
    return bcryptjs.hash(password, SALT_ROUNDS);
};

export const samePassword = async (inputPassword, hashedPassword) => {
    return bcryptjs.compare(inputPassword, hashedPassword);
};

export const generateJWT = (payload) => {
    return jsonwebtoken.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );
};

export const verifyTokenJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token required" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};