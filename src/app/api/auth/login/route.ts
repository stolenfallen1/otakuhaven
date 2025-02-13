import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/utils/hash_password";
import { signJWT } from "@/utils/jwt";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json({ message: 'Invalid credentials. Check email or password' }, { status: 401 });
        }

        if (!user.emailVerified) {
            return NextResponse.json({ 
                message: 'Please verify your email before logging in',
                isVerified: false,
                email: user.email,
                canResend: true
            }, { status: 401 });
        }

        const isValidPassword = await verifyPassword(password, user.password);
        if (!isValidPassword) {
            return NextResponse.json({ message: 'Invalid credentials. Check email or password' }, { status: 401 });
        }

        const token = await signJWT({
            id: user.id,
            email: user.email,
            role: user.role,
        });

        const response = NextResponse.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                emailVerified: user.emailVerified,
            },
            token
        });

        response.cookies.set({
            name: 'token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 24 hours
            path: '/'
        });

        return response;

    } catch(error) {
        console.error('Login error: ', error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}