import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth-server'

export async function GET(request: Request) {
    try {
        const user = await getUserFromRequest(request)
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const sessions = await prisma.session.findMany({
            where: {
                OR: [
                    { teacher_id: user.userId },
                    { learner_id: user.userId }
                ]
            },
            include: {
                teacher: { select: { name: true, email: true } },
                learner: { select: { name: true, email: true } }
            },
            orderBy: { scheduled_at: 'desc' }
        })

        return NextResponse.json({ sessions })

    } catch (error) {
        console.error('Fetch sessions error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
