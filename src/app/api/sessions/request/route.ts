import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { z } from 'zod'

const requestSessionSchema = z.object({
    targetUserId: z.string().min(1),
    skillName: z.string().min(1),
    role: z.enum(['teacher', 'learner']), // Role of the CURRENT user
    scheduledAt: z.string().optional() // Optional for now, default to now or future
})

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const validation = requestSessionSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.format() }, { status: 400 })
        }

        const { targetUserId, skillName, role, scheduledAt } = validation.data

        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!currentUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // Determine who is teacher and who is learner
        let teacherId, learnerId;
        if (role === 'learner') {
            // I am learner, target is teacher
            learnerId = currentUser.id
            teacherId = targetUserId
        } else {
            // I am teacher, target is learner
            teacherId = currentUser.id
            learnerId = targetUserId
        }

        const newSession = await prisma.sessionModel.create({
            data: {
                teacher_id: teacherId,
                learner_id: learnerId,
                status: 'pending',
                scheduled_at: scheduledAt ? new Date(scheduledAt) : new Date(Date.now() + 86400000), // Default 1 day later
                initiated_by: currentUser.id,
                tokens_used: 10 // Default cost
            }
        })

        return NextResponse.json({ success: true, session: newSession })

    } catch (error) {
        console.error("Error requesting session:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
