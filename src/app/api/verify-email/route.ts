import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signJWT } from "@/utils/jwt";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
        return NextResponse.json({ message: "Missing verification token" }, { status: 400 });
    }

    try {
        const user = await prisma.user.findFirst({
            where: { verificationToken: token }
        });

        if (!user) {
            return NextResponse.json({ message: "Invalid verification token" }, { status: 400 });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                verificationToken: null
            }
        });

        const jwt = await signJWT({
            id: user.id,
            email: user.email,
            role: user.role
        });

        const response = NextResponse.redirect(new URL('/', request.url));
        
        response.cookies.set({
            name: 'token',
            value: jwt,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        });

        return response;

    } catch (error) {
        console.error('Verification error:', error);
        return NextResponse.json({ message: "Error verifying email" }, { status: 500 });
    }
}