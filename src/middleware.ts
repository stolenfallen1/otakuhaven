import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "@/utils/jwt";

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const path = request.nextUrl.pathname

    if (path.startsWith('/sign-in') || path.startsWith('/sign-up')) {
        if (token) {
            try {
                await verifyJWT(token)
                return NextResponse.redirect(new URL('/', request.url))
            } catch {
                return NextResponse.next()
            }
        }
        return NextResponse.next()
    }

    if (path.startsWith('/admin') || path.startsWith('/account') || path.startsWith('/orders')) {
        if (!token) {
            return NextResponse.redirect(new URL('/sign-in', request.url))
        }

        try {
            await verifyJWT(token)
            return NextResponse.next()
        } catch {
            return NextResponse.redirect(new URL('/sign-in', request.url))
        }
    }
    return NextResponse.next()
}

export const config = {
    matcher: ['/sign-in', '/sign-up', '/account/:path*', '/orders/:path*', '/admin/:path*']
}