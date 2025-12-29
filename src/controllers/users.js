import { hashPassword } from "../utils/auth.js";
import { createDBUser, getDBUserbyID, getDBUserByUsername, updateDBUser, updateDBUserTheme } from "../utils/database.js";

export const createUser =  async (request, response) => {
    try {
        let mObjResponse = await createDBUser(request.body);

        response.status(201);
        return response.json(mObjResponse)
    } catch(error) {
        response.status(400)
        return response.json({
            error: error.message
        })
    }
}

export const getUserByUsername = async (request, response) => {
    try {
        const mObjUser = await getDBUserByUsername(request.params.username)

        response.status(200);
        return response.json(mObjUser);
    } catch(error) {
        response.status(400)
        return response.json({
            error: error.message
        })
    }
}

export const getUser = async (request, response) => {
    try {
        const mObjUser = await getDBUserbyID(request.user.id)

        response.status(200)
        return response.json(mObjUser);
    } catch(error) {
        response.status(400)
        return response.json({
            error: error.message
        });
    }
}

export const updateUser = async (request, response) => {
    try {
        if (request.body.username || request.body.id || request.body.createdAt || request.body.updatedAt) throw new Error("Not specify an attibute like this username, id, createdAt, updatedAt");

        if (request.body.password) request.body.password = await hashPassword(request.body.password);

        if (request.body.theme && !["default", "dark", "minimal", "neon"].includes(request.body.theme)) throw new Error(`Only specify only of each theme ["default", "dark", "minimal", "neon"]`);

        let mObjUser = await updateDBUser(request.user.id, request.body)

        response.status(200)
        return response.json({
            message: "User updated",
            user: mObjUser
        })
    } catch(error) {
        response.status(400)
        return response.json({
            error: error.message
        });
    }
}

export const updateTheme = async (request, response) => {
    try {
        if (!request.body.theme) throw new Error("Specify a theme");

        if (!["default", "dark", "minimal", "neon"].includes(request.body.theme)) throw new Error(`Only specify only of each theme ["default", "dark", "minimal", "neon"]`);

        let mObjUser = await updateDBUserTheme(request.user.id, request.body.theme)

        response.status(200)
        return response.json({
            message: "Theme updated",
            user: mObjUser
        });
    } catch(error) {
        response.status(400)
        return response.json({
            error: error.message
        });
    }
}
