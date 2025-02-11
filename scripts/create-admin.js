const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdmin(email, name, password) {
    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        
        const admin = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'ADMIN',
                emailVerified: true,
            }
        });

        console.log('Admin created:', admin);
    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

const [email, name, password] = process.argv.slice(2);

if (!email || !name || !password) {
    console.log('Usage: node create-admin.js <email> <name> <password>');
    process.exit(1);
}

createAdmin(email, name, password);