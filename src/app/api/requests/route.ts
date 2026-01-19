import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { z } from 'zod'

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!currentUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const mySessions = await prisma.sessionModel.findMany({
            where: {
                OR: [
                    { teacher_id: currentUser.id },
                    { learner_id: currentUser.id }
                ]
            },
            include: {
                teacher: { select: { id: true, name: true, image: true } },
                learner: { select: { id: true, name: true, image: true } }
            },
            orderBy: { created_at: 'desc' }
        })

        return NextResponse.json({ sessions: mySessions, currentUserId: currentUser.id })

    } catch (error) {
        console.error("Error fetching requests:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

// Update Status (Accept/Reject)
const updateStatusSchema = z.object({
    sessionId: z.string().min(1),
    status: z.enum(['scheduled', 'cancelled', 'completed']) // 'scheduled' = accepted
})

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const validation = updateStatusSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.format() }, { status: 400 })
        }

        const { sessionId, status } = validation.data

        const updatedSession = await prisma.sessionModel.update({
            where: { id: sessionId },
            data: { status }
        })

        return NextResponse.json(updatedSession)

    } catch (error) {
        console.error("Error updating session:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
