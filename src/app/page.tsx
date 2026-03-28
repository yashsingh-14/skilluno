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
import { ArrowRight, Sparkles, Coins, Users, Star, Zap, Shield, Globe, Github, Twitter, Instagram, Mail, ChevronRight, Play } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const TESTIMONIALS = [
    {
        name: "Arjun Mehta",
        role: "Taught Guitar, Learned React",
        text: "SkillUNO transformed the way I learn. I taught guitar and earned enough tokens to master React from an expert. Best platform ever!",
        rating: 5,
        avatar: "AM"
    },
    {
        name: "Priya Sharma",
        role: "Full-stack Developer",
        text: "The token system is genius. I've been teaching Python and using tokens to learn UI design. The video calls make sessions feel premium.",
        rating: 5,
        avatar: "PS"
    },
    {
        name: "Rahul Verma",
        role: "Music Student",
        text: "Found an amazing piano teacher through the matching system. The whole experience from matching to video sessions was seamless.",
        rating: 5,
        avatar: "RV"
    },
]

const FEATURES = [
    {
        icon: Sparkles,
        title: "Smart Matching",
        description: "Our algorithm finds the perfect teacher-student pairs based on skills, levels, and preferences.",
        color: "purple"
    },
    {
        icon: Coins,
        title: "Token Economy",
        description: "Earn tokens by teaching, spend them to learn. No real money needed to start — your skills are your currency.",
        color: "yellow"
    },
    {
        icon: Shield,
        title: "Verified Sessions",
        description: "Two-step verification ensures quality. Teachers mark complete, learners confirm and pay.",
        color: "emerald"
    },
    {
        icon: Globe,
        title: "Learn Anything",
        description: "From coding to cooking, music to marketing — exchange any skill with people worldwide.",
        color: "blue"
    },
]

export default function LandingPage() {
    const { data: session } = useSession()
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const lenis = new Lenis({ lerp: 0.08 })

        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)

        const ctx = gsap.context(() => {
            gsap.from('.hero-text', {
                y: 80,
                opacity: 0,
                duration: 1.2,
                ease: 'power4.out',
                stagger: 0.15,
            })

            // Animate sections on scroll
            gsap.utils.toArray('.reveal-section').forEach((el: any) => {
                gsap.from(el, {
                    y: 60,
                    opacity: 0,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse',
                    }
                })
            })
        }, containerRef)

        return () => {
            ctx.revert()
            lenis.destroy()
        }
    }, [])

    const colorMap: Record<string, string> = {
        purple: 'from-purple-900/20 group-hover:from-purple-900/30 text-purple-400',
        blue: 'from-blue-900/20 group-hover:from-blue-900/30 text-blue-400',
        yellow: 'from-yellow-900/20 group-hover:from-yellow-900/30 text-yellow-400',
        emerald: 'from-emerald-900/20 group-hover:from-emerald-900/30 text-emerald-400',
        pink: 'from-pink-900/20 group-hover:from-pink-900/30 text-pink-400',
    }

    return (
        <main ref={containerRef} className="min-h-screen text-white overflow-hidden relative">

            {/* =========== NAVIGATION =========== */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 backdrop-blur-xl bg-black/20 border-b border-white/[0.04]">
                <Logo size="large" />
                <div className="flex items-center gap-3">
                    {session ? (
                        <Link href="/dashboard" className="group flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-black hover:bg-gray-100 transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                            Dashboard
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    ) : (
                        <>
                            <Link href="/auth/login" className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">
                                Login
                            </Link>
                            <Link href="/auth/signup" className="group flex items-center gap-2 rounded-full bg-white/[0.07] px-5 py-2.5 text-sm font-medium text-white hover:bg-white/[0.12] border border-white/[0.08] transition-all backdrop-blur-sm">
                                Get Started
                                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* =========== HERO SECTION =========== */}
            <section className="relative flex min-h-screen flex-col items-center justify-center pt-20">
                {/* 3D Background */}
                <div className="absolute inset-0 z-0 opacity-70">
                    <HeroScene />
                </div>

                {/* Floating gradient orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] animate-float-slow pointer-events-none" />
                <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] animate-float pointer-events-none" />

                <div className="relative z-10 text-center px-4 mb-12">
                    <div className="hero-text inline-flex items-center gap-2 rounded-full bg-white/[0.05] border border-white/[0.08] px-4 py-1.5 text-xs font-medium text-purple-300 mb-8 backdrop-blur-sm">
                        <Sparkles className="h-3.5 w-3.5" />
                        Token-Powered Skill Exchange Platform
                    </div>

                    <h1 className="hero-text text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tight leading-[0.9]">
                        <span className="gradient-text-hero">Learn. Teach.</span>
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-purple-400">
                            Exchange.
                        </span>
                    </h1>

                    <p className="hero-text mt-6 max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-zinc-400 font-light leading-relaxed">
                        Your skills have value. Earn tokens by teaching what you know.
                        <br className="hidden sm:block" />
                        <span className="text-zinc-200">Spend them to master something new.</span>
                    </p>

                    <div className="hero-text mt-8 flex flex-col sm:flex-row justify-center gap-3">
                        {session ? (
                            <Link href="/dashboard" className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-4 text-base font-bold text-white transition-all hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(147,51,234,0.4)] active:scale-[0.98]">
                                Enter Dashboard
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        ) : (
                            <>
                                <Link href="/auth/signup" className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-black transition-all hover:scale-[1.03] hover:bg-gray-50 active:scale-[0.98]">
                                    Start Learning Free
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                                <Link href="#how-it-works" className="group inline-flex items-center justify-center gap-2 rounded-full bg-white/[0.06] px-6 py-4 text-base font-medium text-zinc-300 border border-white/[0.08] hover:bg-white/[0.1] transition-all">
                                    <Play className="h-4 w-4" />
                                    See How it Works
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Stats + Marquee */}
                <div className="relative z-10 w-full mt-8">
                    <Stats />
                    <SkillsMarquee />
                </div>
            </section>

            {/* =========== FEATURES SECTION =========== */}
            <section className="py-24 px-6 relative z-10 reveal-section">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 border border-purple-500/20 px-4 py-1.5 text-xs font-medium text-purple-400 mb-4">
                            <Zap className="h-3.5 w-3.5" />
                            Why SkillUNO
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                            Everything you need to
                            <br />
                            <span className="gradient-text-purple">exchange skills</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {FEATURES.map((feature, i) => (
                            <TiltCard key={i} className="rounded-2xl p-px glass-card group">
                                <div className={`h-full p-8 rounded-2xl bg-gradient-to-br ${colorMap[feature.color]} to-transparent transition-all`}>
                                    <div className={`inline-flex p-3 rounded-xl bg-white/[0.05] mb-5 ${colorMap[feature.color].split(' ').pop()}`}>
                                        <feature.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                                    <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
                                </div>
                            </TiltCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* =========== HOW IT WORKS =========== */}
            <section id="how-it-works" className="py-24 px-6 relative z-10 reveal-section">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 text-xs font-medium text-blue-400 mb-4">
                            <Play className="h-3.5 w-3.5" />
                            Simple Process
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold text-glow tracking-tight">
                            How it works
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 relative">
                        {/* Connecting line */}
                        <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20" />

                        {[
                            { num: "01", title: "Earn Tokens", desc: "Teach your skills to others. Whether it's coding, music, or cooking — your expertise has real value. Earn tokens for every session.", color: "purple", icon: Coins },
                            { num: "02", title: "Spend Tokens", desc: "Use your hard-earned tokens to book 1-on-1 sessions with expert mentors from around the globe. Invest in yourself.", color: "blue", icon: Sparkles },
                            { num: "03", title: "Grow Together", desc: "Build your reputation, get rated, climb the leaderboard and become a top-tier mentor in the community.", color: "pink", icon: Users },
                        ].map((step, i) => (
                            <TiltCard key={i} className="rounded-2xl p-px glass-card group">
                                <div className={`h-full p-8 rounded-2xl bg-gradient-to-br ${colorMap[step.color]} to-transparent transition-all relative`}>
                                    {/* Step number */}
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className={`flex items-center justify-center h-12 w-12 rounded-xl bg-white/[0.05] ${colorMap[step.color].split(' ').pop()} font-mono text-lg font-bold`}>
                                            {step.num}
                                        </div>
                                        <step.icon className={`h-5 w-5 ${colorMap[step.color].split(' ').pop()}`} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-white">{step.title}</h3>
                                    <p className="text-zinc-400 leading-relaxed">{step.desc}</p>
                                </div>
                            </TiltCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* =========== TESTIMONIALS =========== */}
            <section className="py-24 px-6 relative z-10 reveal-section">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="inline-flex items-center gap-2 rounded-full bg-pink-500/10 border border-pink-500/20 px-4 py-1.5 text-xs font-medium text-pink-400 mb-4">
                            <Star className="h-3.5 w-3.5" />
                            Loved by learners
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                            What our community says
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {TESTIMONIALS.map((t, i) => (
                            <TiltCard key={i} className="rounded-2xl p-px glass-card group">
                                <div className="h-full p-6 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent">
                                    {/* Stars */}
                                    <div className="flex gap-1 mb-4">
                                        {Array.from({ length: t.rating }).map((_, j) => (
                                            <Star key={j} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                        ))}
                                    </div>
                                    {/* Quote */}
                                    <p className="text-zinc-300 text-sm leading-relaxed mb-6 italic">
                                        &ldquo;{t.text}&rdquo;
                                    </p>
                                    {/* Author */}
                                    <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-sm font-bold text-white">
                                            {t.avatar}
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-white">{t.name}</div>
                                            <div className="text-xs text-zinc-500">{t.role}</div>
                                        </div>
                                    </div>
                                </div>
                            </TiltCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* =========== CTA SECTION =========== */}
            <section className="py-24 px-6 relative z-10 reveal-section">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="relative rounded-3xl overflow-hidden p-px">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-purple-600/30 animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                        <div className="relative rounded-3xl bg-zinc-950 p-12 md:p-16">
                            {/* Decorative glow */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-purple-600/20 blur-[100px] pointer-events-none" />

                            <div className="relative z-10">
                                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                                    Ready to start <span className="gradient-text-purple">exchanging</span>?
                                </h2>
                                <p className="text-zinc-400 text-lg mb-8 max-w-xl mx-auto">
                                    Join thousands of learners and teachers already exchanging skills on SkillUNO. Your journey starts now.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Link href="/auth/signup" className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-base font-bold text-white transition-all hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(147,51,234,0.4)] active:scale-[0.98]">
                                        Create Free Account
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                                    </Link>
                                    <Link href="/auth/login" className="inline-flex items-center justify-center gap-2 rounded-full bg-white/[0.06] px-6 py-4 text-base font-medium text-zinc-300 border border-white/[0.08] hover:bg-white/[0.1] transition-all">
                                        I already have an account
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========== FOOTER =========== */}
            <footer className="border-t border-white/[0.04] bg-black/40 relative z-10">
                <div className="max-w-6xl mx-auto px-6 py-16">
                    <div className="grid md:grid-cols-4 gap-10 mb-12">
                        {/* Brand */}
                        <div className="md:col-span-1">
                            <Logo size="large" />
                            <p className="mt-4 text-sm text-zinc-500 leading-relaxed">
                                A token-based skill exchange platform where your expertise is your currency.
                            </p>
                        </div>

                        {/* Links */}
                        <div>
                            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Platform</h4>
                            <ul className="space-y-2.5">
                                {['Dashboard', 'Skills', 'Matches', 'Sessions'].map(l => (
                                    <li key={l}>
                                        <Link href={`/${l.toLowerCase()}`} className="text-sm text-zinc-500 hover:text-white transition-colors">
                                            {l}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Account</h4>
                            <ul className="space-y-2.5">
                                {[{name:'Login', href:'/auth/login'}, {name:'Sign Up', href:'/auth/signup'}, {name:'Settings', href:'/settings'}, {name:'Wallet', href:'/wallet'}].map(l => (
                                    <li key={l.name}>
                                        <Link href={l.href} className="text-sm text-zinc-500 hover:text-white transition-colors">
                                            {l.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Connect</h4>
                            <div className="flex gap-3">
                                <a href="https://github.com/yashsingh-14" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-9 w-9 rounded-lg bg-white/[0.04] border border-white/[0.06] text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-all">
                                    <Github className="h-4 w-4" />
                                </a>
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-9 w-9 rounded-lg bg-white/[0.04] border border-white/[0.06] text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-all">
                                    <Twitter className="h-4 w-4" />
                                </a>
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-9 w-9 rounded-lg bg-white/[0.04] border border-white/[0.06] text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-all">
                                    <Instagram className="h-4 w-4" />
                                </a>
                                <a href="mailto:contact@skilluno.com" className="flex items-center justify-center h-9 w-9 rounded-lg bg-white/[0.04] border border-white/[0.06] text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-all">
                                    <Mail className="h-4 w-4" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/[0.04]">
                        <p className="text-xs text-zinc-600">
                            © {new Date().getFullYear()} SkillUNO. Crafted with passion.
                        </p>
                        <p className="text-xs text-zinc-600 mt-2 md:mt-0">
                            Built by <a href="https://github.com/yashsingh-14" target="_blank" rel="noopener noreferrer" className="text-purple-400/70 hover:text-purple-400 transition-colors">Yash Singh</a>
                        </p>
                    </div>
                </div>
            </footer>
        </main>
    )
}
