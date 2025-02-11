import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/mail";
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();
        
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        if (user.emailVerified) {
            return NextResponse.json({ message: "Email already verified" }, { status: 400 });
        }

        const verificationToken = crypto.randomBytes(32).toString('hex');
        
        await prisma.user.update({
            where: { id: user.id },
            data: { verificationToken }
        });

        await sendVerificationEmail(user.email, user.name, verificationToken);

        return NextResponse.json({ 
            message: "Verification email sent",
            email: user.email 
        });

    } catch (error) {
        console.error('Resend verification error:', error);
        return NextResponse.json({ message: "Error sending verification email" }, { status: 500 });
    }
}