import express from "express";
import helmet from "helmet";
import cors from "cors";
import authRouter from "./routes/auth";
import userRouter from "./routes/users";
import linksRouter from "./routes/links";
import analyticRouter from "./routes/analytics";
import publicRouter from "./routes/public";

const app = express();

app.use(helmet());
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/links", linksRouter);
app.use("/api/analytics", analyticRouter);
app.use("/api/track", analyticRouter);
app.use("/@:username", publicRouter)

export default app;