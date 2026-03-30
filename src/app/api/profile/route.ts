export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                languages: true,
                location: true,
                rating_avg: true,
                created_at: true,
                _count: {
                    select: {
                        teachSkills: true,
                        learnSkills: true,
                        sessionsAsTeacher: true,
                        sessionsAsLearner: true,
                    }
                }
            }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({ user })

    } catch (error) {
        console.error('Profile fetch error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { name, languages, location } = await request.json()

        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: {
                ...(name !== undefined && { name }),
                ...(languages !== undefined && { languages }),
                ...(location !== undefined && { location }),
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                languages: true,
                location: true,
            }
        })

        return NextResponse.json({ success: true, user: updatedUser })

    } catch (error) {
        console.error('Profile update error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
