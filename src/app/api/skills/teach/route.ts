export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get User ID from DB using email (safest way)
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const body = await request.json()
        const { category, skill_name, level, experience, mode, language, availability } = body

        // Basic Validation
        if (!skill_name || !category || !level || !mode) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const newSkill = await prisma.teachSkill.create({
            data: {
                user_id: user.id,
                category,
                skill_name,
                level,
                experience: Number(experience) || 0,
                mode,
                language,
                availability: JSON.stringify(availability || []), // Store as String
            },
        })

        return NextResponse.json({ success: true, skill: newSkill })
    } catch (error) {
        console.error('Error adding teach skill:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const skills = await prisma.teachSkill.findMany({
            where: { user_id: user.id },
            orderBy: { created_at: 'desc' }
        })

        return NextResponse.json({ success: true, skills })
    } catch (error) {
        console.error('Error fetching teach skills:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
