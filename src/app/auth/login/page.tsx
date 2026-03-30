'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { Loader2, Mail, Lock, ArrowRight } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'

export default function LoginPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const err = searchParams.get('error')
        if (err) {
            const messages: Record<string, string> = {
                OAuthSignin: 'Error starting Google sign in',
                OAuthCallback: 'Error during Google callback',
                OAuthCreateAccount: 'Could not create account',
                Callback: 'Auth callback error',
                Default: 'Authentication error',
            }
            setError(messages[err] || messages.Default)
        }
    }, [searchParams])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError('')

        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData)

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (!res.ok) {
                const json = await res.json()
                throw new Error(json.error || 'Login failed')
            }

            const { success } = await res.json()

            if (success) {
                router.push('/dashboard')
                router.refresh()
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-black text-white px-4 relative overflow-hidden">
            {/* Animated background blobs */}
            <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] animate-float-slow pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] animate-float pointer-events-none" />

            <div className="relative w-full max-w-md animate-scale-in">
                {/* Gradient border wrapper */}
                <div className="gradient-border rounded-2xl">
                    <div className="rounded-2xl bg-zinc-950/90 backdrop-blur-xl p-8 space-y-8">
                        {/* Logo & Header */}
                        <div className="text-center space-y-3">
                            <div className="flex justify-center mb-4">
                                <Link href="/">
                                    <Logo size="large" />
                                </Link>
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
                            <p className="text-sm text-zinc-500">Sign in to continue your journey</p>
                        </div>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {error && (
                                <div className="rounded-xl bg-red-500/10 p-3.5 text-sm text-red-400 border border-red-500/20 animate-fade-in-up">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label htmlFor="email" className="block text-xs font-medium text-zinc-400 uppercase tracking-wider">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            placeholder="you@example.com"
                                            className="input-premium pl-10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="password" className="block text-xs font-medium text-zinc-400 uppercase tracking-wider">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            placeholder="••••••••"
                                            className="input-premium pl-10"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 text-sm font-bold text-white transition-all hover:from-purple-500 hover:to-indigo-500 hover:shadow-[0_0_25px_rgba(147,51,234,0.3)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                            >
                                {loading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <>
                                        Sign in
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                                    </>
                                )}
                            </button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-white/[0.06]" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-zinc-950 px-3 text-zinc-600 tracking-wider">Or</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                disabled={googleLoading}
                                onClick={async () => {
                                    setGoogleLoading(true)
                                    setError('')
                                    try {
                                        await signIn('google', { callbackUrl: '/dashboard' })
                                    } catch (e) {
                                        setError('Google sign in failed')
                                        setGoogleLoading(false)
                                    }
                                }}
                                className="flex w-full items-center justify-center gap-3 rounded-xl bg-white/[0.05] border border-white/[0.08] px-4 py-3 text-sm font-medium text-white hover:bg-white/[0.08] transition-all active:scale-[0.98]"
                            >
                                <svg className="h-4 w-4" aria-hidden="true" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Continue with Google
                            </button>
                        </form>

                        <p className="text-center text-sm text-zinc-600">
                            Don&apos;t have an account?{' '}
                            <Link href="/auth/signup" className="font-semibold text-purple-400 hover:text-purple-300 transition-colors">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
