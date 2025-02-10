import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || '';

export async function signJWT(payload: any) {
    const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('24h')
        .sign(new TextEncoder().encode(JWT_SECRET))

    return token;
}

export async function verifyJWT(token: string) {
    try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
        return payload;
    } catch(error) {
        return null;
    }
}