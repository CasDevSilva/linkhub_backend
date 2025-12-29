export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    const status = err.status || 500;
    const message = err.message || "Internal server error";

    res.status(status).json({
        error: message,
        ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
    });
};

export class AppError extends Error {
    constructor(message, status = 400) {
        super(message);
        this.status = status;
    }
}