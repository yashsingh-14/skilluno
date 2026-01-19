import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'


const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_production'

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10)
}

export const comparePassword = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash)
}

export const signToken = (payload: object) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET)
    } catch (error) {
        return null
    }
}

// Note: In Next.js 15+, cookies() is async. However, this helper is used in API routes where
// we can't always await it easily if the caller isn't async.
// BUT, for App Router API routes, they ARE async.
// Let's refactor signature to be async.

// getUserFromRequest moved to @/lib/auth-server.ts to prevent Middleware crashes
