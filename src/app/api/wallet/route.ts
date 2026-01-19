import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth-server'

export async function GET(request: Request) {
    try {
        const user = await getUserFromRequest(request)
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const balance = await prisma.tokenBalance.findUnique({
            where: { user_id: user.userId }
        })

        const transactions = await prisma.tokenTransaction.findMany({
            where: { user_id: user.userId },
            orderBy: { created_at: 'desc' },
            take: 20 // Limit to recent 20
        })

        return NextResponse.json({
            balance: balance?.balance || 0,
            transactions
        })

    } catch (error) {
        console.error('Wallet error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
