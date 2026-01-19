import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hashPassword, signToken } from '@/lib/auth'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, password } = body

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 })
        }

        const hashedPassword = await hashPassword(password)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password_hash: hashedPassword,
                // Initialize token balance properly if needed, usually via TokenBalance model or default
            },
        })

        // Initialize TokenBalance
        await prisma.tokenBalance.create({
            data: {
                user_id: user.id,
                balance: 100, // Sign up bonus?
            },
        })

        const token = signToken({ userId: user.id, email: user.email, role: 'LEARNER' }) // Default role

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
    } catch (error) {
        console.error('Signup error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
