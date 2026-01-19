import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
    // Check for NextAuth session
    const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

    // Check for Custom Auth token
    const customToken = request.cookies.get('token')?.value
    const isCustomAuthValid = customToken && verifyToken(customToken)

    const isAuthenticated = !!session || !!isCustomAuthValid

    // Paths that require authentication
    const protectedPaths = ['/dashboard', '/skills', '/learn', '/matches', '/sessions', '/wallet']
    const isProtected = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))

    if (isProtected) {
        if (!isAuthenticated) {
            return NextResponse.redirect(new URL('/auth/login', request.url))
        }
    }

    // Redirect authenticated users away from auth pages
    if (request.nextUrl.pathname.startsWith('/auth')) {
        if (isAuthenticated) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/skills/:path*',
        '/learn/:path*',
        '/matches/:path*',
        '/sessions/:path*',
        '/wallet/:path*',
        '/auth/:path*',
    ],
}
