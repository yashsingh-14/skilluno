import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { comparePassword, signToken } from '@/lib/auth'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, password } = body

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        const isMatch = await comparePassword(password, user.password_hash)

        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        const token = signToken({ userId: user.id, email: user.email, role: 'LEARNER' }) // Should fetch role from user

        const response = NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email } })

        // Set Secure HTTP-Only Cookie
        response.cookies.set({
            name: 'token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        })

        return response
        return response
    } catch (error) {
        console.error('Login error details:', error)
        // Check if error is Prisma related
        if (typeof error === 'object' && error !== null && 'code' in error) {
            console.error('Prisma Error Code:', (error as any).code)
        }
        return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 })
    }
}
