import { generateJWT, samePassword } from "../utils/auth.js";
import { getDBUserByUsername } from "../utils/database.js";

export async function loginUser(request, response) {
    try {
        let mObjUser = await getDBUserByUsername(request.body.username);

        if (mObjUser) {
            let mBoolSamePwd = await samePassword(request.body.password, mObjUser.password);

            if (!mBoolSamePwd) {
                throw new Error("Contraseña incorrecta.")
            }

            let mStrToken = await generateJWT({
                id: mObjUser.id,
                email: mObjUser.email,
                username: mObjUser.username
            })

            response.status(200)
            return response.json({
                message: "Login correcto.",
                token: mStrToken
            });
        } else {
            throw new Error("Usuario inexistente.")
        }
    } catch(error) {
        response.status(400)
        return response.json({
            error: error.message
        });
    }
}