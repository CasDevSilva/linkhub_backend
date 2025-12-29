import express from "express";
import helmet from "helmet";
import cors from "cors";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/users.js";
import linksRouter from "./routes/links.js";
import analyticRouter from "./routes/analytics.js";
import publicRouter from "./routes/public.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/links", linksRouter);
app.use("/api/analytics", analyticRouter);
app.use("/api/track", analyticRouter);
app.use("/@:username", publicRouter)

export default app;