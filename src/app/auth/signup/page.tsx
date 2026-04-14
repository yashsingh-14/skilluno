'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { Loader2, Mail, Lock, User, ArrowRight } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'

export default function SignupPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError('')

        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData)

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (!res.ok) {
                const json = await res.json()
                throw new Error(json.error || 'Signup failed')
            }

            router.push('/dashboard')
            router.refresh()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#030303] text-white px-4 relative overflow-hidden">
            {/* Ferrofluid SVG Filter */}
            <svg width="0" height="0" style={{ position: 'absolute' }}>
                <filter id="ferrofluid-auth">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur" />
                    <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -10" result="goo" />
                    <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                </filter>
            </svg>

            {/* Ferrofluid Animated Background */}
            <div className="ferrofluid-canvas" style={{ opacity: 0.5 }}>
                <div className="globule globule-1"></div>
                <div className="globule globule-2"></div>
            </div>

            <div className="relative z-10 w-full max-w-md animate-scale-in">
                {/* Glassmorphism Card */}
                <div className="rounded-2xl bg-white/[0.08] backdrop-blur-3xl backdrop-saturate-150 border border-white/[0.12] shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-6 space-y-5">
                    {/* Logo & Header */}
                    <div className="text-center space-y-2">
                        <div className="flex justify-center mb-2">
                            <Link href="/">
                                <Logo size="large" />
                            </Link>
                        </div>
                        <h2 className="text-3xl font-bold text-white">Create Account</h2>
                        <p className="text-sm text-gray-300 font-medium">Join the SkillUNO community</p>
                    </div>

                    {/* Google Sign Up — Prominent */}
                    <button
                        type="button"
                        onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                        className="w-full flex items-center justify-center py-2.5 px-4 bg-white/[0.07] border border-white/[0.1] hover:bg-white/[0.12] rounded-xl text-white font-semibold focus:outline-none transition-all duration-300 active:scale-[0.98]"
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Sign up with Google
                    </button>

                    {/* Divider */}
                    <div className="relative flex py-1 items-center">
                        <div className="flex-grow border-t border-white/[0.06]"></div>
                        <span className="flex-shrink mx-4 text-zinc-400 text-xs font-medium uppercase tracking-wider">Or with email</span>
                        <div className="flex-grow border-t border-white/[0.06]"></div>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="rounded-xl bg-red-500/10 p-3.5 text-sm text-red-400 border border-red-500/20 animate-fade-in-up">
                                {error}
                            </div>
                        )}

                        {/* Name — Floating Label */}
                        <div className="relative z-0">
                            <input
                                type="text"
                                id="signup_name"
                                name="name"
                                autoComplete="name"
                                required
                                placeholder=" "
                                className="block py-2.5 px-0 w-full text-sm text-white font-medium bg-transparent border-0 border-b-2 border-zinc-600 appearance-none focus:outline-none focus:ring-0 focus:border-purple-500 peer"
                            />
                            <label
                                htmlFor="signup_name"
                                className="absolute text-sm text-gray-300 font-medium duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                                <User className="inline-block mr-2 -mt-1" size={16} />
                                Full Name
                            </label>
                        </div>

                        {/* Email — Floating Label */}
                        <div className="relative z-0">
                            <input
                                type="email"
                                id="signup_email"
                                name="email"
                                autoComplete="email"
                                required
                                placeholder=" "
                                className="block py-2.5 px-0 w-full text-sm text-white font-medium bg-transparent border-0 border-b-2 border-zinc-600 appearance-none focus:outline-none focus:ring-0 focus:border-purple-500 peer"
                            />
                            <label
                                htmlFor="signup_email"
                                className="absolute text-sm text-gray-300 font-medium duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                                <Mail className="inline-block mr-2 -mt-1" size={16} />
                                Email Address
                            </label>
                        </div>

                        {/* Password — Floating Label */}
                        <div className="relative z-0">
                            <input
                                type="password"
                                id="signup_password"
                                name="password"
                                autoComplete="new-password"
                                required
                                minLength={8}
                                placeholder=" "
                                className="block py-2.5 px-0 w-full text-sm text-white font-medium bg-transparent border-0 border-b-2 border-zinc-600 appearance-none focus:outline-none focus:ring-0 focus:border-purple-500 peer"
                            />
                            <label
                                htmlFor="signup_password"
                                className="absolute text-sm text-gray-300 font-medium duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                                <Lock className="inline-block mr-2 -mt-1" size={16} />
                                Password (min 8 chars)
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="group w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl text-white font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 transition-all duration-300 hover:shadow-[0_0_25px_rgba(147,51,234,0.3)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link href="/auth/login" className="font-semibold text-purple-400 hover:text-purple-300 transition">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
