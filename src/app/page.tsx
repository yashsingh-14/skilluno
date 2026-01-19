'use client'

import { useEffect, useRef } from 'react'
import HeroScene from '@/components/landing/HeroScene'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { TiltCard } from '@/components/ui/TiltCard'
import { Logo } from '@/components/ui/Logo'
import SkillsMarquee from '@/components/landing/SkillsMarquee'
import Stats from '@/components/landing/Stats'

gsap.registerPlugin(ScrollTrigger)

export default function LandingPage() {
    const { data: session } = useSession()
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const lenis = new Lenis()

        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)

        const ctx = gsap.context(() => {
            gsap.from('.hero-text', {
                y: 100,
                opacity: 0,
                duration: 1.5,
                ease: 'power4.out',
                stagger: 0.2,
            })
        }, containerRef)

        return () => {
            ctx.revert()
            lenis.destroy()
        }
    }, [])

    return (
        <main ref={containerRef} className="min-h-screen text-white overflow-hidden">
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 backdrop-blur-md bg-black/10 border-b border-white/5">
                <Logo size="large" />
                <div className="flex gap-4">
                    {session ? (
                        <Link href="/dashboard" className="rounded-full bg-white px-6 py-2 text-sm font-bold text-black hover:bg-gray-200 transition-colors">
                            Go to Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link href="/auth/login" className="px-4 py-2 hover:text-purple-300 transition-colors">Login</Link>
                            <Link href="/auth/signup" className="rounded-full bg-white/10 px-6 py-2 text-white hover:bg-white/20 border border-white/20 transition-all backdrop-blur-sm">Get Started</Link>
                        </>
                    )}
                </div>
            </nav>

            <section className="relative flex min-h-screen flex-col items-center justify-center pt-20">
                <div className="absolute inset-0 z-0 opacity-100">
                    <HeroScene />
                </div>

                <div className="relative z-10 text-center px-4 mb-20">
                    <h1 className="hero-text text-6xl font-extrabold tracking-tight md:text-9xl text-glow">
                        Learn. Teach. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-purple-300 to-zinc-200 opacity-80">
                            Exchange.
                        </span>
                    </h1>
                    <p className="hero-text mt-6 max-w-2xl mx-auto text-lg text-zinc-400 md:text-2xl font-light">
                        A premium token-based skill exchange platform. <br />
                        <span className="text-white">Master new skills. Share expertise. Join the elite.</span>
                    </p>
                    <div className="hero-text mt-10 flex justify-center gap-4">
                        {session ? (
                            <Link href="/dashboard" className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg font-bold text-white transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                                Enter Dashboard
                            </Link>
                        ) : (
                            <Link href="/auth/signup" className="rounded-full bg-white px-8 py-4 text-lg font-bold text-black transition-transform hover:scale-105 hover:bg-gray-100">
                                Start Learning
                            </Link>
                        )}
                    </div>
                </div>

                {/* New Components */}
                <div className="relative z-10 w-full mb-10">
                    <Stats />
                    <SkillsMarquee />
                </div>
            </section>

            <section className="min-h-screen py-20 px-8 relative z-10">
                <h2 className="text-4xl font-bold mb-16 text-center text-glow">How it works</h2>
                <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    <TiltCard className="rounded-2xl p-1 bg-zinc-900/40 glass-card group">
                        <div className="h-full p-8 rounded-xl bg-gradient-to-br from-purple-900/10 to-zinc-900/50 backdrop-blur-sm transition-all group-hover:from-purple-900/20">
                            <h3 className="text-2xl font-bold mb-4 text-purple-400">1. Earn Tokens</h3>
                            <p className="text-zinc-400 text-lg leading-relaxed">Teach your skills to others. Whether it's coding, music, or cooking, your expertise has value. Earn tokens for every session.</p>
                        </div>
                    </TiltCard>

                    <TiltCard className="rounded-2xl p-1 bg-zinc-900/40 glass-card group">
                        <div className="h-full p-8 rounded-xl bg-gradient-to-br from-blue-900/10 to-zinc-900/50 backdrop-blur-sm transition-all group-hover:from-blue-900/20">
                            <h3 className="text-2xl font-bold mb-4 text-blue-400">2. Spend Tokens</h3>
                            <p className="text-zinc-400 text-lg leading-relaxed">Use your hard-earned tokens to book 1-on-1 sessions with experts from around the globe. Invest in yourself.</p>
                        </div>
                    </TiltCard>

                    <TiltCard className="rounded-2xl p-1 bg-zinc-900/40 glass-card group">
                        <div className="h-full p-8 rounded-xl bg-gradient-to-br from-pink-900/10 to-zinc-900/50 backdrop-blur-sm transition-all group-hover:from-pink-900/20">
                            <h3 className="text-2xl font-bold mb-4 text-pink-400">3. Grow Together</h3>
                            <p className="text-zinc-400 text-lg leading-relaxed">Build your reputation. Get rated. Climb the leaderboard and become a top-tier mentor in the community.</p>
                        </div>
                    </TiltCard>
                </div>
            </section>
        </main>
    )
}
