import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const sessions = await prisma.sessionModel.findMany({
            where: {
                OR: [
                    { teacher_id: user.id },
                    { learner_id: user.id }
                ]
            },
            include: {
                teacher: { select: { name: true, email: true, image: true } },
                learner: { select: { name: true, email: true, image: true } }
            },
            orderBy: { scheduled_at: 'desc' }
        })

        return NextResponse.json({ sessions })

    } catch (error) {
        console.error('Fetch sessions error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
