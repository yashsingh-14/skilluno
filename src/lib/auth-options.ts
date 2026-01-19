import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            console.log("👉 SIGNIN CALLBACK:", { user, account, profile });
            return true;
        },
        async session({ session, token }) {
            console.log("👉 SESSION CALLBACK:", { session, token });
            if (session.user) {
                session.user.id = token.sub!
            }
            return session
        },
        async jwt({ token, user, account }) {
            console.log("👉 JWT CALLBACK:", { token, user, account });
            return token;
        }
    },
    pages: {
        signIn: '/auth/login',
    },
    debug: true,
    secret: process.env.NEXTAUTH_SECRET,
}
