import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/utils/hash_password";
import { signJWT } from "@/utils/jwt";
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const { email, password, name } = await request.json()

        const existingUser = await prisma.user.findUnique({
            where: { email: email }
        })

        if (existingUser) {
            return NextResponse.json({ message: 'Email already registered' }, { status: 409 });
        }

        const hashedPassword = await hashPassword(password)
        const verificationToken = crypto.randomBytes(32).toString('hex');

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                verificationToken,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                emailVerified: true,
            }
        })

        const token = signJWT({
            id: user.id,
            email: user.email,
            role: user.role,
        })

        return NextResponse.json({ user, token })

    } catch(error) {
        console.error('Registration error: ', error);
        return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
    }
}