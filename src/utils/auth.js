import bcryptjs from "bcryptjs";

export async function hashPassword(pStrPassword) {
    const mIntSaltRounds = 2;
    const mStrPassword = await bcryptjs.hash(pStrPassword, mIntSaltRounds);

    return mStrPassword;
}

export async function samePassword(pStrInputPassword, pStrPassword) {
    const mBoolSamePwd = await bcryptjs.compare(pStrInputPassword, pStrPassword);
    return mBoolSamePwd;
}