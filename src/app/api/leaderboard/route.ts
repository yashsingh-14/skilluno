import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        // Top teachers by rating
        const topTeachers = await prisma.user.findMany({
            where: {
                rating_avg: { gt: 0 },
                teachSkills: { some: {} }
            },
            select: {
                id: true,
                name: true,
                image: true,
                rating_avg: true,
                location: true,
                _count: {
                    select: {
                        teachSkills: true,
                        sessionsAsTeacher: { where: { status: 'completed' } },
                    }
                }
            },
            orderBy: { rating_avg: 'desc' },
            take: 10,
        })

        // Most active users (most completed sessions)
        const mostActive = await prisma.user.findMany({
            where: {
                OR: [
                    { sessionsAsTeacher: { some: { status: 'completed' } } },
                    { sessionsAsLearner: { some: { status: 'completed' } } },
                ]
            },
            select: {
                id: true,
                name: true,
                image: true,
                rating_avg: true,
                _count: {
                    select: {
                        sessionsAsTeacher: { where: { status: 'completed' } },
                        sessionsAsLearner: { where: { status: 'completed' } },
                    }
                }
            },
            take: 10,
        })

        // Sort by total completed sessions
        const sortedActive = mostActive
            .map(u => ({
                ...u,
                totalSessions: u._count.sessionsAsTeacher + u._count.sessionsAsLearner
            }))
            .sort((a, b) => b.totalSessions - a.totalSessions)

        // Platform stats
        const totalUsers = await prisma.user.count()
        const totalSessions = await prisma.sessionModel.count({ where: { status: 'completed' } })
        const totalSkills = await prisma.teachSkill.count()

        return NextResponse.json({
            topTeachers,
            mostActive: sortedActive,
            stats: { totalUsers, totalSessions, totalSkills }
        })

    } catch (error) {
        console.error('Leaderboard error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
