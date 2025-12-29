import { prisma } from "../config/database.js"
import { hashPassword } from "./auth.js";

// Users
export const createDBUser = async (pObjInformation) => {
    let mObjUser = {
        email       : pObjInformation.email,
        password    : await hashPassword(pObjInformation.password),
        username    : pObjInformation.username,
        displayName : pObjInformation.displayName || pObjInformation.username,
        bio         : pObjInformation.bio || "Not description",
        avatar      : pObjInformation.avatar || "",
        theme       : pObjInformation.theme || "default"
    }

    await prisma.user.create({data: mObjUser});

    return mObjUser;
}

export const getDBUserByUsername = async (pStrUserName) => {
    const mObjUser = await prisma.user.findUnique({
        where: {
            username: pStrUserName
        }
    })

    return mObjUser;
}

export const getDBUserbyID = async (pIntUserID) => {
    const mObjUser = await prisma.user.findUnique({
        where: {
            id: pIntUserID
        }
    })

    return mObjUser;
}

export const updateDBUser = async (pIntUserID, pObjUser) => {
    const mObjUpdUser = await prisma.user.update({
        where: {
            id: pIntUserID
        },
        data: pObjUser
    });

    return mObjUpdUser;
}

export const updateDBUserTheme = async (pIntUserID, pStrTheme) => {
    const mObjUpdUserTheme = await prisma.user.update({
        where: {
            id: pIntUserID
        },
        data: {
            theme: pStrTheme
        }
    });

    return {
        username: mObjUpdUserTheme.username,
        theme: mObjUpdUserTheme.theme
    };
}


// Links
export const createDBLink = async (pObjInformation) => {
    let mObjLink = {
        userId: pObjInformation.userId,
        title: pObjInformation.title,
        url: pObjInformation.url,
        icon: pObjInformation.icon,
        order: pObjInformation.order,
        isActive: pObjInformation.isActive
    };

    await prisma.link.create({data: mObjLink})

    return mObjLink;
}

export const getDBLink = async (pIntUserId) => {
    let mArrLinks = await prisma.link.findMany({
        where: {
            userId: pIntUserId
        }
    })

    return mArrLinks;
}

export const updateDBLink = async (pIntUserId, pIntLinkID, pObjLink) => {
    let mObjLink = await prisma.link.update({
        where: {
            userId: pIntUserId,
            id: pIntLinkID
        },
        data: pObjLink
    })

    return mObjLink;
}

export const deleteDBLink = async (pIntUserId, pIntLinkID) => {
    let mObjLink = await prisma.link.delete({
        where: {
            userId: pIntUserId,
            id: pIntLinkID
        }
    })

    return mObjLink;
}

// Clicks