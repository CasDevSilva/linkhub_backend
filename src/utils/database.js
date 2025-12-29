import { prisma } from "../config/database.js";
import { hashPassword } from "./auth.js";

// ==================== USERS ====================

export const createDBUser = async (pObjInformation) => {
    const user = await prisma.user.create({
        data: {
            email: pObjInformation.email,
            password: await hashPassword(pObjInformation.password),
            username: pObjInformation.username.toLowerCase(),
            displayName: pObjInformation.displayName || pObjInformation.username,
            bio: pObjInformation.bio || "",
            avatar: pObjInformation.avatar || "",
            theme: pObjInformation.theme || "default"
        }
    });

    const { password, ...safeUser } = user;
    return safeUser;
};

export const getDBUserByUsername = async (username) => {
    return prisma.user.findUnique({
        where: { username: username.toLowerCase() }
    });
};

export const getDBUserByEmail = async (email) => {
    return prisma.user.findUnique({
        where: { email: email.toLowerCase() }
    });
};

export const getDBUserbyID = async (id) => {
    return prisma.user.findUnique({
        where: { id }
    });
};

export const updateDBUser = async (id, data) => {
    return prisma.user.update({
        where: { id },
        data
    });
};

export const updateDBUserTheme = async (id, theme) => {
    return prisma.user.update({
        where: { id },
        data: { theme },
        select: { username: true, theme: true }
    });
};

// ==================== LINKS ====================

export const createDBLink = async (data) => {
    const count = await prisma.link.count({ where: { userId: data.userId } });

    return prisma.link.create({
        data: {
            userId: data.userId,
            title: data.title,
            url: data.url,
            icon: data.icon || null,
            order: data.order ?? count,
            isActive: data.isActive ?? true
        }
    });
};

export const getDBLinks = async (userId) => {
    return prisma.link.findMany({
        where: { userId },
        orderBy: { order: "asc" }
    });
};

export const getDBLinkById = async (id) => {
    return prisma.link.findUnique({
        where: { id }
    });
};

export const updateDBLink = async (userId, id, data) => {
    return prisma.link.update({
        where: { id, userId },
        data
    });
};

export const deleteDBLink = async (userId, id) => {
    return prisma.link.delete({
        where: { id, userId }
    });
};

export const reorderDBLinks = async (userId, orderedIds) => {
    const updates = orderedIds.map((id, index) =>
        prisma.link.update({
            where: { id, userId },
            data: { order: index }
        })
    );
    return prisma.$transaction(updates);
};

// ==================== CLICKS ====================

export const createDBClick = async (data) => {
    return prisma.click.create({ data });
};

export const getDBClicksByUser = async (userId, filters = {}) => {
    const { startDate, endDate } = filters;

    const where = { userId };

    if (startDate || endDate) {
        where.timestamp = {};
        if (startDate) where.timestamp.gte = new Date(startDate);
        if (endDate) where.timestamp.lte = new Date(endDate);
    }

    return prisma.click.findMany({
        where,
        orderBy: { timestamp: "desc" }
    });
};

export const getDBClicksOverview = async (userId) => {
    const [totalClicks, last24h, last7d, last30d] = await Promise.all([
        prisma.click.count({ where: { userId } }),
        prisma.click.count({
            where: {
                userId,
                timestamp: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
            }
        }),
        prisma.click.count({
            where: {
                userId,
                timestamp: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
            }
        }),
        prisma.click.count({
            where: {
                userId,
                timestamp: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
            }
        })
    ]);

    return { totalClicks, last24h, last7d, last30d };
};

export const getDBClicksByDevice = async (userId) => {
    const clicks = await prisma.click.groupBy({
        by: ["device"],
        where: { userId },
        _count: { device: true }
    });

    return clicks.map(c => ({
        device: c.device || "unknown",
        count: c._count.device
    }));
};

export const getDBClicksByReferrer = async (userId, limit = 10) => {
    const clicks = await prisma.click.groupBy({
        by: ["referrer"],
        where: { userId, referrer: { not: null } },
        _count: { referrer: true },
        orderBy: { _count: { referrer: "desc" } },
        take: limit
    });

    return clicks.map(c => ({
        referrer: c.referrer,
        count: c._count.referrer
    }));
};

export const getDBClicksTimeline = async (userId, days = 7) => {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const clicks = await prisma.click.findMany({
        where: {
            userId,
            timestamp: { gte: startDate }
        },
        select: { timestamp: true }
    });

    // Agrupar por día
    const grouped = {};
    clicks.forEach(c => {
        const day = c.timestamp.toISOString().split("T")[0];
        grouped[day] = (grouped[day] || 0) + 1;
    });

    return Object.entries(grouped)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));
};

// ==================== PUBLIC ====================

export const getDBPublicProfile = async (username) => {
    return prisma.user.findUnique({
        where: { username: username.toLowerCase() },
        select: {
            username: true,
            displayName: true,
            bio: true,
            avatar: true,
            theme: true,
            links: {
                where: { isActive: true },
                orderBy: { order: "asc" },
                select: {
                    id: true,
                    title: true,
                    url: true,
                    icon: true
                }
            }
        }
    });
};