export const dynamic = 'force-dynamic'
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

        const balance = await prisma.tokenBalance.findUnique({
            where: { user_id: user.id }
        })

        const transactions = await prisma.tokenTransaction.findMany({
            where: { user_id: user.id },
            orderBy: { created_at: 'desc' },
            take: 20
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
