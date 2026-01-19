import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const sessionId = searchParams.get('sessionId')

        if (!sessionId) {
            return NextResponse.json({ error: "Session ID required" }, { status: 400 })
        }

        const session = await getServerSession(authOptions)
        if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const currentUser = await prisma.user.findUnique({ where: { email: session.user.email } })
        if (!currentUser) return NextResponse.json({ error: "User not found" }, { status: 404 })

        const sessionData = await prisma.sessionModel.findUnique({
            where: { id: sessionId }
        })

        if (!sessionData) return NextResponse.json({ error: "Session not found" }, { status: 404 })

        return NextResponse.json({ session: sessionData, currentUserId: currentUser.id })
    } catch (error) {
        console.error("Error fetching session detail:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
