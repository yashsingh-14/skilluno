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
            where: { email: session.user.email }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Get token balance
        const tokenBalance = await prisma.tokenBalance.findUnique({
            where: { user_id: user.id }
        })

        // Count completed sessions
        const completedSessions = await prisma.sessionModel.count({
            where: {
                OR: [
                    { teacher_id: user.id },
                    { learner_id: user.id }
                ],
                status: 'completed'
            }
        })

        // Count upcoming sessions (accepted, not completed)
        const upcomingSessions = await prisma.sessionModel.count({
            where: {
                OR: [
                    { teacher_id: user.id },
                    { learner_id: user.id }
                ],
                status: 'accepted'
            }
        })

        // Get average rating (reviews on sessions where user participated)
        const ratings = await prisma.review.findMany({
            where: {
                session: {
                    OR: [
                        { teacher_id: user.id },
                        { learner_id: user.id }
                    ]
                }
            },
            select: { rating: true }
        })

        const avgRating = ratings.length > 0
            ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
            : 0

        // Recent transactions (for "change" display)
        const recentTokens = await prisma.tokenTransaction.aggregate({
            where: {
                user_id: user.id,
                type: 'earned',
                created_at: {
                    gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
                }
            },
            _sum: { amount: true }
        })

        return NextResponse.json({
            balance: tokenBalance?.balance || 0,
            completedSessions,
            upcomingSessions,
            avgRating: Number(avgRating.toFixed(1)),
            reviewCount: ratings.length,
            weeklyEarnings: recentTokens._sum.amount || 0
        })

    } catch (error) {
        console.error('Dashboard stats error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
