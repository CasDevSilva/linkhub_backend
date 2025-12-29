import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import "dotenv/config";

export const hashPassword = async (pStrPassword) => {
    const mIntSaltRounds = 2;
    const mStrPassword = await bcryptjs.hash(pStrPassword, mIntSaltRounds);

    return mStrPassword;
}

export const samePassword = async (pStrInputPassword, pStrPassword) => {
    const mBoolSamePwd = await bcryptjs.compare(pStrInputPassword, pStrPassword);
    return mBoolSamePwd;
}

export const generateJWT = async (pObjUser) => {
    const mStrToken = jsonwebtoken.sign(
        pObjUser,
        process.env["JWT_SECRET"],
        { expiresIn: '1h'}
    );

    return mStrToken;
}

export const verifyTokenJWT = async (request, response, next) => {
    const mStrToken = request.headers['authorization']?.split(' ')[1];

    if (!mStrToken) return response.status(403).send("Token requerido");

    jsonwebtoken.verify(mStrToken, process.env["JWT_SECRET"], (err, decoded) => {
        if (err) return response.status(401).send("Token inválido");

        request.user = decoded
        next();
    })
}