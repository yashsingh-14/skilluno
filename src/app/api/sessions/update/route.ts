import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth-server'

export async function POST(request: Request) {
    try {
        const user = await getUserFromRequest(request)
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { session_id, action } = await request.json()

        if (!session_id || !action) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
        }

        const session = await prisma.session.findUnique({
            where: { id: session_id }
        })

        if (!session) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 })
        }

        // Authorization checks
        const isTeacher = session.teacher_id === user.userId
        const isLearner = session.learner_id === user.userId

        if (action === 'accept' || action === 'reject') {
            if (!isTeacher) return NextResponse.json({ error: 'Only teacher can accept/reject' }, { status: 403 })

            await prisma.session.update({
                where: { id: session_id },
                data: { status: action === 'accept' ? 'accepted' : 'rejected' }
            })

            return NextResponse.json({ success: true, status: action === 'accept' ? 'accepted' : 'rejected' })
        }

        if (action === 'complete') {
            // Can be triggered by both, but usually automatically or by teacher. Let's say Teacher marks complete.
            if (!isTeacher) return NextResponse.json({ error: 'Only teacher can mark complete' }, { status: 403 })

            // TRANSACTION: Transfer Tokens
            // 1. Deduct from Learner
            // 2. Add to Teacher

            await prisma.$transaction([
                prisma.session.update({
                    where: { id: session_id },
                    data: { status: 'completed' }
                }),
                prisma.tokenBalance.update({
                    where: { user_id: session.learner_id },
                    data: { balance: { decrement: session.tokens_used } }
                }),
                prisma.tokenBalance.update({
                    where: { user_id: session.teacher_id },
                    data: { balance: { increment: session.tokens_used } }
                }),
                // Record Transactions
                prisma.tokenTransaction.create({
                    data: {
                        user_id: session.learner_id,
                        type: 'spent',
                        amount: session.tokens_used,
                        session_id: session.id
                    }
                }),
                prisma.tokenTransaction.create({
                    data: {
                        user_id: session.teacher_id,
                        type: 'earned',
                        amount: session.tokens_used,
                        session_id: session.id
                    }
                })
            ])

            return NextResponse.json({ success: true, status: 'completed' })
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

    } catch (error) {
        console.error('Session update error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
