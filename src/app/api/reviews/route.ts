export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

export async function POST(request: Request) {
    try {
        const authSession = await getServerSession(authOptions)
        if (!authSession?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: authSession.user.email }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const { session_id, rating, comment } = await request.json()

        if (!session_id || !rating || rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'Invalid rating (1-5 required)' }, { status: 400 })
        }

        // Check session exists and is completed
        const sessionData = await prisma.sessionModel.findUnique({
            where: { id: session_id },
            include: { review: true }
        })

        if (!sessionData) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 })
        }

        if (sessionData.status !== 'completed') {
            return NextResponse.json({ error: 'Can only review completed sessions' }, { status: 400 })
        }

        if (sessionData.review) {
            return NextResponse.json({ error: 'Session already reviewed' }, { status: 400 })
        }

        // Ensure the reviewer is part of the session
        if (sessionData.teacher_id !== user.id && sessionData.learner_id !== user.id) {
            return NextResponse.json({ error: 'Not part of this session' }, { status: 403 })
        }

        // Create review
        const review = await prisma.review.create({
            data: {
                session_id,
                rating,
                comment: comment || null,
            }
        })

        // Update the OTHER user's average rating
        const reviewedUserId = sessionData.teacher_id === user.id
            ? sessionData.learner_id  // If I'm teacher, review the learner
            : sessionData.teacher_id  // If I'm learner, review the teacher

        const allReviews = await prisma.review.findMany({
            where: {
                session: {
                    OR: [
                        { teacher_id: reviewedUserId },
                        { learner_id: reviewedUserId }
                    ]
                }
            }
        })

        const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length

        await prisma.user.update({
            where: { id: reviewedUserId },
            data: { rating_avg: avgRating }
        })

        return NextResponse.json({ success: true, review })

    } catch (error) {
        console.error('Review error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function GET(request: Request) {
    try {
        const authSession = await getServerSession(authOptions)
        if (!authSession?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const url = new URL(request.url)
        const sessionId = url.searchParams.get('session_id')

        if (sessionId) {
            const review = await prisma.review.findUnique({
                where: { session_id: sessionId }
            })
            return NextResponse.json({ review })
        }

        return NextResponse.json({ error: 'session_id required' }, { status: 400 })

    } catch (error) {
        console.error('Review fetch error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
