import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

export async function sendVerificationEmail(to: string, name: string, token: string) {
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-email?token=${token}`;
    
    await transporter.sendMail({
        from: '"OtakuHaven" <noreply@otakuhaven.com>',
        to,
        subject: 'Welcome to OtakuHaven - Verify Your Email',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #7c3aed;">Welcome to OtakuHaven!</h1>
                <p>Hi ${name},</p>
                <p>Please verify your email address by clicking the button below:</p>
                <a href="${verificationUrl}" 
                    style="background-color: #7c3aed; color: white; padding: 12px 24px; 
                            text-decoration: none; border-radius: 6px; display: inline-block; 
                            margin: 16px 0;">
                        Verify Email
                </a>
                <p style="color: #666; font-size: 14px;">
                    If you didn't create an account, you can safely ignore this email.
                </p>
            </div>
        `
    });
}