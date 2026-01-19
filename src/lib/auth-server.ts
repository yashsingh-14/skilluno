import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

export const getUserFromRequest = async (request: Request) => {
    // Try to get token from cookies using next/headers
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) return null
    return verifyToken(token) as { userId: string, email: string, role: string } | null
}
