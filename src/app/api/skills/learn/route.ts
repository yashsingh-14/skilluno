import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { z } from 'zod'

const learnSkillSchema = z.object({
    category: z.string().min(1, "Category is required"),
    skill_name: z.string().min(1, "Skill name is required"),
    desired_level: z.string().min(1, "Desired level is required"),
    mode_preference: z.string().min(1, "Mode preference is required"),
    language_preference: z.string().min(1, "Language preference is required"),
    availability: z.string().optional().default("[]"), // JSON stringified array of slots
})

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const validation = learnSkillSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.format() }, { status: 400 })
        }

        const { category, skill_name, desired_level, mode_preference, language_preference, availability } = validation.data

        // Get user ID from email
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const newSkill = await prisma.learnSkill.create({
            data: {
                user_id: user.id,
                category,
                skill_name,
                desired_level,
                mode_preference,
                language_preference,
                availability
            }
        })

        return NextResponse.json(newSkill, { status: 201 })

    } catch (error) {
        console.error("Error adding learn skill:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { learnSkills: true }
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        return NextResponse.json(user.learnSkills)

    } catch (error) {
        console.error("Error fetching learn skills:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
