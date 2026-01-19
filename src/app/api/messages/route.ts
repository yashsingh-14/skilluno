import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { z } from 'zod'

// GET: Fetch messages between current user and another user
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const targetUserId = searchParams.get('targetUserId')

        if (!targetUserId) {
            return NextResponse.json({ error: "Target User ID required" }, { status: 400 })
        }

        const session = await getServerSession(authOptions)
        if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const currentUser = await prisma.user.findUnique({ where: { email: session.user.email } })
        if (!currentUser) return NextResponse.json({ error: "User not found" }, { status: 404 })

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: currentUser.id, receiverId: targetUserId },
                    { senderId: targetUserId, receiverId: currentUser.id }
                ]
            },
            orderBy: { created_at: 'asc' }
        })

        return NextResponse.json({ messages })
    } catch (error) {
        console.error("Error fetching messages:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

// POST: Send a message
const sendMessageSchema = z.object({
    receiverId: z.string().min(1),
    content: z.string().min(1)
})

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const body = await req.json()
        const validation = sendMessageSchema.safeParse(body)
        if (!validation.success) return NextResponse.json({ error: validation.error.format() }, { status: 400 })

        const currentUser = await prisma.user.findUnique({ where: { email: session.user.email } })
        if (!currentUser) return NextResponse.json({ error: "User not found" }, { status: 404 })

        const newMessage = await prisma.message.create({
            data: {
                senderId: currentUser.id,
                receiverId: validation.data.receiverId,
                content: validation.data.content
            }
        })
        return NextResponse.json(newMessage)
    } catch (error) {
        console.error("Error sending message:", error)
        return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
    }
}
