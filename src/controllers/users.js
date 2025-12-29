import { prisma } from "../config/database.js"
import { hashPassword } from "../utils/auth.js";

export async function createUser(request, response) {
    try {
        let mObjBody = request.body;
        let mObjUser = {
            email       : mObjBody.email,
            password    : hashPassword(mObjBody.password),
            username    : mObjBody.username,
            displayName : mObjBody.displayName || mObjBody.username,
            bio         : mObjBody.bio || "Not description",
            avatar      : mObjBody.avatar || "",
            theme       : mObjBody.theme || "default",
            createdAt   : Date.now()
        }

        await prisma.user.create(mObjUser);

        response.status(201);
        return response.json(mObjUser)
    } catch(error) {
        response.status(400)
        return response.json({
            error: error.message
        })
    }
}

export async function getUserByUsername(request, response) {
    try {
        const mObjUser = await prisma.user.findUnique({
            where: {
                username: request.params.username
            }
        })

        response.status(200);
        return response.json(mObjUser);
    } catch(error) {
        response.status(400)
        return response.json({
            error: error.message
        })
    }
}

export function getUser(request, response){
}

export function updateUser(request, response) {
    
}

export function updateTheme(request, response) {
}