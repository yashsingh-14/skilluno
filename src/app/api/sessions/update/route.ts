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

        const { session_id, action } = await request.json()

        if (!session_id || !action) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
        }

        const sessionData = await prisma.sessionModel.findUnique({
            where: { id: session_id }
        })

        if (!sessionData) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 })
        }

        // Authorization checks
        const isTeacher = sessionData.teacher_id === user.id
        const isLearner = sessionData.learner_id === user.id

        if (action === 'accept' || action === 'reject') {
            if (!isTeacher) return NextResponse.json({ error: 'Only teacher can accept/reject' }, { status: 403 })

            await prisma.sessionModel.update({
                where: { id: session_id },
                data: { status: action === 'accept' ? 'accepted' : 'rejected' }
            })

            return NextResponse.json({ success: true, status: action === 'accept' ? 'accepted' : 'rejected' })
        }

        if (action === 'complete') {
            if (!isTeacher) return NextResponse.json({ error: 'Only teacher can mark complete' }, { status: 403 })

            // TRANSACTION: Transfer Tokens
            await prisma.$transaction([
                prisma.sessionModel.update({
                    where: { id: session_id },
                    data: { status: 'completed' }
                }),
                prisma.tokenBalance.update({
                    where: { user_id: sessionData.learner_id },
                    data: { balance: { decrement: sessionData.tokens_used } }
                }),
                prisma.tokenBalance.update({
                    where: { user_id: sessionData.teacher_id },
                    data: { balance: { increment: sessionData.tokens_used } }
                }),
                // Record Transactions
                prisma.tokenTransaction.create({
                    data: {
                        user_id: sessionData.learner_id,
                        type: 'spent',
                        amount: sessionData.tokens_used,
                        session_id: sessionData.id
                    }
                }),
                prisma.tokenTransaction.create({
                    data: {
                        user_id: sessionData.teacher_id,
                        type: 'earned',
                        amount: sessionData.tokens_used,
                        session_id: sessionData.id
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
