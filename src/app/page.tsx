'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { TiltCard } from '@/components/ui/TiltCard'
import { Logo } from '@/components/ui/Logo'
import { ContainerScroll, CardsContainer, CardTransformed, ReviewStars } from '@/components/ui/animated-cards-stack'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
    {
        name: "Sneha Patel",
        role: "Taught Yoga, Learning Piano",
        text: "The matching algorithm is incredible. Found the perfect piano teacher within minutes. The token economy makes fair pricing effortless.",
        rating: 4.5,
        avatar: "SP"
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
        <main ref={containerRef} className="min-h-screen text-white relative">

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
            <section className="relative z-20 flex min-h-screen flex-col items-center justify-center pt-20 bg-[#030303] overflow-hidden">
                {/* Ferrofluid SVG Filter */}
                <svg width="0" height="0" style={{ position: 'absolute' }}>
                    <filter id="ferrofluid">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur" />
                        <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -10" result="goo" />
                        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                    </filter>
                </svg>

                {/* Ferrofluid Animated Background */}
                <div className="ferrofluid-canvas">
                    <div className="globule globule-1"></div>
                    <div className="globule globule-2"></div>
                </div>

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
            <section className="py-24 px-6 relative z-20 reveal-section bg-[#030303]">
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
            <section id="how-it-works" className="py-28 px-6 relative z-20 reveal-section bg-[#030303]">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-20">
                        <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 text-xs font-medium text-blue-400 mb-4">
                            <Play className="h-3.5 w-3.5" />
                            Simple Process
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                            How it <span className="gradient-text-purple">works</span>
                        </h2>
                        <p className="mt-4 text-zinc-500 max-w-md mx-auto">
                            Three simple steps to start exchanging skills with people worldwide.
                        </p>
                    </div>

                    {/* Steps */}
                    <div className="space-y-0">
                        {[
                            {
                                num: "01",
                                title: "Teach & Earn Tokens",
                                desc: "List your skills — coding, music, design, fitness, cooking — anything you're great at. When someone books a session, you earn tokens for every hour you teach.",
                                icon: Coins,
                                gradient: "from-purple-500 to-violet-600",
                                glow: "shadow-purple-500/25",
                            },
                            {
                                num: "02",
                                title: "Spend Tokens to Learn",
                                desc: "Browse expert mentors and book 1-on-1 video sessions using your tokens. No real money needed — your skills are your currency.",
                                icon: Sparkles,
                                gradient: "from-blue-500 to-indigo-600",
                                glow: "shadow-blue-500/25",
                            },
                            {
                                num: "03",
                                title: "Grow & Level Up",
                                desc: "Earn reviews, climb the leaderboard, and unlock achievements. Build your reputation as a top-tier mentor in the community.",
                                icon: Users,
                                gradient: "from-pink-500 to-rose-600",
                                glow: "shadow-pink-500/25",
                            },
                        ].map((step, i) => (
                            <div key={i} className="relative flex gap-6 md:gap-10 group">
                                {/* Timeline line + number */}
                                <div className="flex flex-col items-center">
                                    <div className={`relative flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br ${step.gradient} shadow-lg ${step.glow} text-white font-mono text-lg font-bold z-10 group-hover:scale-110 transition-transform duration-300`}>
                                        {step.num}
                                        {/* Pulse ring */}
                                        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-40 blur-md transition-opacity duration-500`} />
                                    </div>
                                    {i < 2 && (
                                        <div className="w-px h-full min-h-[80px] bg-gradient-to-b from-white/[0.08] to-transparent" />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="pb-12 pt-2 flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <step.icon className={`h-5 w-5 text-transparent bg-clip-text`} style={{ color: i === 0 ? '#a855f7' : i === 1 ? '#6366f1' : '#ec4899' }} />
                                        <h3 className="text-xl md:text-2xl font-bold text-white">{step.title}</h3>
                                    </div>
                                    <p className="text-zinc-400 leading-relaxed max-w-lg">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* =========== TESTIMONIALS (Animated Card Stack) =========== */}
            <section className="relative z-[5] px-8 py-12 bg-[#0a0a0a]">
                <div className="text-center mb-4">
                    <span className="inline-flex items-center gap-2 rounded-full bg-pink-500/10 border border-pink-500/20 px-4 py-1.5 text-xs font-medium text-pink-400 mb-4">
                        <Star className="h-3.5 w-3.5" />
                        Loved by learners
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                        What our community says
                    </h2>
                    <p className="mt-3 text-zinc-500 text-sm max-w-md mx-auto">
                        Real stories from learners and teachers who exchanged skills on SkillUNO.
                    </p>
                </div>
                <ContainerScroll className="mx-auto max-w-6xl h-[300vh]">
                    <div className="sticky left-0 top-0 h-svh w-full py-12">
                        <CardsContainer className="mx-auto size-full h-[450px] w-[350px]">
                            {TESTIMONIALS.map((testimonial, index) => (
                                <CardTransformed
                                    arrayLength={TESTIMONIALS.length}
                                    key={index}
                                    variant="dark"
                                    index={index + 2}
                                    role="article"
                                >
                                    <div className="flex flex-col items-center space-y-4 text-center">
                                        <ReviewStars
                                            className="text-yellow-400"
                                            rating={testimonial.rating}
                                        />
                                        <div className="mx-auto w-4/5 text-lg text-white">
                                            <blockquote>&ldquo;{testimonial.text}&rdquo;</blockquote>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Avatar className="!size-12 border border-stone-700">
                                            <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-sm font-bold text-white">
                                                {testimonial.avatar}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <span className="block text-lg font-semibold tracking-tight text-white md:text-xl">
                                                {testimonial.name}
                                            </span>
                                            <span className="block text-sm text-zinc-500">
                                                {testimonial.role}
                                            </span>
                                        </div>
                                    </div>
                                </CardTransformed>
                            ))}
                        </CardsContainer>
                    </div>
                </ContainerScroll>
            </section>

            {/* =========== CTA SECTION =========== */}
            <section className="py-24 px-6 relative z-20 reveal-section bg-[#030303]">
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
                                    {session ? (
                                        <Link href="/dashboard" className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-base font-bold text-white transition-all hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(147,51,234,0.4)] active:scale-[0.98]">
                                            Go to Dashboard
                                            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                                        </Link>
                                    ) : (
                                        <>
                                            <Link href="/auth/signup" className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-base font-bold text-white transition-all hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(147,51,234,0.4)] active:scale-[0.98]">
                                                Create Free Account
                                                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                                            </Link>
                                            <Link href="/auth/login" className="inline-flex items-center justify-center gap-2 rounded-full bg-white/[0.06] px-6 py-4 text-base font-medium text-zinc-300 border border-white/[0.08] hover:bg-white/[0.1] transition-all">
                                                I already have an account
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========== FOOTER =========== */}
            <footer className="border-t border-white/[0.04] bg-[#030303] relative z-20">
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
                            <div className="flex gap-5">
                                {[
                                    {
                                        name: 'GitHub',
                                        href: 'https://github.com/yashsingh-14',
                                        hoverBg: '#333',
                                        hoverShadow: 'rgba(51,51,51,0.6)',
                                        icon: <Github className="h-5 w-5" />,
                                    },
                                    {
                                        name: 'Twitter',
                                        href: 'https://twitter.com',
                                        hoverBg: '#1DA1F2',
                                        hoverShadow: 'rgba(29,161,242,0.6)',
                                        icon: <Twitter className="h-5 w-5" />,
                                    },
                                    {
                                        name: 'Instagram',
                                        href: 'https://instagram.com',
                                        hoverBg: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
                                        hoverShadow: 'rgba(225,48,108,0.6)',
                                        icon: <Instagram className="h-5 w-5" />,
                                    },
                                    {
                                        name: 'Email',
                                        href: 'mailto:contact@skilluno.com',
                                        hoverBg: '#9333ea',
                                        hoverShadow: 'rgba(147,51,234,0.6)',
                                        icon: <Mail className="h-5 w-5" />,
                                    },
                                ].map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        target={social.href.startsWith('mailto') ? undefined : '_blank'}
                                        rel="noopener noreferrer"
                                        className="social-icon-shake group flex flex-col items-center gap-2"
                                    >
                                        <div
                                            className="flex items-center justify-center h-14 w-14 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-400 group-hover:text-white group-hover:-translate-y-2 group-hover:scale-110 transition-all duration-300 backdrop-blur-sm"
                                            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
                                            onMouseEnter={(e) => {
                                                const el = e.currentTarget
                                                el.style.background = social.hoverBg
                                                el.style.boxShadow = `0 0 20px ${social.hoverShadow}`
                                            }}
                                            onMouseLeave={(e) => {
                                                const el = e.currentTarget
                                                el.style.background = 'rgba(255,255,255,0.04)'
                                                el.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)'
                                            }}
                                        >
                                            {social.icon}
                                        </div>
                                        <span className="text-[10px] font-medium text-zinc-600 group-hover:text-zinc-300 transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0">
                                            {social.name}
                                        </span>
                                    </a>
                                ))}
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
