import { User } from '@prisma/client';

export type SafeUser = Omit<User , 'password' | 'verificationToken'>

export interface AuthResponse {
    user: SafeUser
    token: string
}