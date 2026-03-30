export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { z } from 'zod'

const completionSchema = z.object({
    sessionId: z.string().min(1),
    action: z.enum(['mark_complete', 'verify', 'dispute'])
})

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const validation = completionSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.format() }, { status: 400 })
        }

        const { sessionId, action } = validation.data

        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!currentUser) return NextResponse.json({ error: "Use not found" }, { status: 404 })

        const sessionData = await prisma.sessionModel.findUnique({
            where: { id: sessionId },
            include: { teacher: true, learner: true }
        })

        if (!sessionData) return NextResponse.json({ error: "Session not found" }, { status: 404 })

        // Logic based on action
        if (action === 'mark_complete') {
            // Only Teacher can mark as complete
            if (currentUser.id !== sessionData.teacher_id) {
                return NextResponse.json({ error: "Only teacher can mark complete" }, { status: 403 })
            }
            if (sessionData.status !== 'scheduled') {
                return NextResponse.json({ error: "Session must be scheduled first" }, { status: 400 })
            }

            const updated = await prisma.sessionModel.update({
                where: { id: sessionId },
                data: { status: 'verify_pending' }
            })
            return NextResponse.json({ success: true, session: updated })
        }

        if (action === 'verify') {
            // Only Learner can verify
            if (currentUser.id !== sessionData.learner_id) {
                return NextResponse.json({ error: "Only learner can verify completion" }, { status: 403 })
            }
            if (sessionData.status !== 'verify_pending') {
                return NextResponse.json({ error: "Session is not pending verification" }, { status: 400 })
            }

            // 1. Mark session complete
            // 2. Transact Tokens

            // Transaction: Learner -> Teacher
            // NOTE: Currently we don't have atomic transactions in this simple setup but we should try.
            // Simplified: Update balances then update session.

            // Check learner balance (Optional: Assuming successful booking means checks were done, 
            // but effectively we deduct now or we deducted at booking? 
            // Better model: Deduct at Booking to Escrow, Release on Completion.
            // Current Simple Model: Just transfer now. (Risk: Learner spent tokens elsewhere).

            const amount = sessionData.tokens_used

            // Update Teacher Balance (Add)
            await prisma.tokenBalance.upsert({
                where: { user_id: sessionData.teacher_id },
                create: { user_id: sessionData.teacher_id, balance: amount },
                update: { balance: { increment: amount } }
            })

            // Update Learner Balance (Subtract) - Assuming sufficient balance or allowing negative for now (or fail)
            await prisma.tokenBalance.upsert({
                where: { user_id: sessionData.learner_id },
                create: { user_id: sessionData.learner_id, balance: -amount }, // Should not happen ideally
                update: { balance: { decrement: amount } }
            })

            // Record Transactions
            await prisma.tokenTransaction.create({
                data: {
                    user_id: sessionData.teacher_id,
                    type: 'earned',
                    amount: amount,
                    session_id: sessionId
                }
            })

            await prisma.tokenTransaction.create({
                data: {
                    user_id: sessionData.learner_id,
                    type: 'spent',
                    amount: amount,
                    session_id: sessionId
                }
            })

            const updated = await prisma.sessionModel.update({
                where: { id: sessionId },
                data: { status: 'completed' }
            })

            return NextResponse.json({ success: true, session: updated })
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 })

    } catch (error) {
        console.error("Error completing session:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
