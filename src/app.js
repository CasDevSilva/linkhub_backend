import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { rateLimit } from "express-rate-limit";

import authRouter from "./routes/auth.js";
import userRouter from "./routes/users.js";
import linksRouter from "./routes/links.js";
import analyticsRouter from "./routes/analytics.js";
import trackRouter from "./routes/track.js";
import publicRouter from "./routes/public.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// Security
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100,
    message: { error: "Too many requests, try again later." }
});
app.use("/api/", limiter);

// Logging
if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
}

// Body parser
app.use(express.json({ limit: "10kb" }));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/links", linksRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/track", trackRouter);
app.use("/@:username", publicRouter);

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Error handler
app.use(errorHandler);

export default app;