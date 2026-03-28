'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { TiltCard } from "@/components/ui/TiltCard"
import { Wallet, BookOpen, Star, Calendar, Activity, ArrowRight, Sparkles, GraduationCap, Zap, Loader2 } from "lucide-react"
import Link from 'next/link'

interface DashboardStats {
    balance: number
    completedSessions: number
    upcomingSessions: number
    avgRating: number
    reviewCount: number
    weeklyEarnings: number
}

export default function DashboardPage() {
    const { data: session } = useSession()
    const firstName = session?.user?.name?.split(' ')[0] || 'there'
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/dashboard/stats')
            .then(r => r.json())
            .then(data => {
                if (!data.error) setStats(data)
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const statCards = [
        {
            label: "Token Balance",
            value: stats?.balance?.toLocaleString() ?? '—',
            change: stats?.weeklyEarnings ? `+${stats.weeklyEarnings} this week` : 'Earn by teaching',
            icon: Wallet,
            gradient: "from-purple-600/20 via-purple-900/10 to-transparent",
            iconBg: "bg-purple-500/10 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]",
            changeColor: "text-purple-400",
            href: "/wallet",
        },
        {
            label: "Sessions",
            value: stats?.completedSessions?.toString() ?? '—',
            change: stats?.completedSessions ? `${stats.completedSessions} completed` : 'Start learning →',
            icon: BookOpen,
            gradient: "from-blue-600/20 via-blue-900/10 to-transparent",
            iconBg: "bg-blue-500/10 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]",
            changeColor: "text-blue-400",
            href: "/sessions",
        },
        {
            label: "Avg Rating",
            value: stats?.avgRating ? stats.avgRating.toFixed(1) : '—',
            change: stats?.reviewCount ? `${stats.reviewCount} reviews` : 'No reviews yet',
            icon: Star,
            gradient: "from-yellow-600/15 via-yellow-900/10 to-transparent",
            iconBg: "bg-yellow-500/10 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.15)]",
            changeColor: "text-yellow-400",
            href: "/settings",
        },
        {
            label: "Upcoming",
            value: stats?.upcomingSessions?.toString() ?? '—',
            change: stats?.upcomingSessions ? `${stats.upcomingSessions} scheduled` : 'Schedule a session',
            icon: Calendar,
            gradient: "from-emerald-600/15 via-emerald-900/10 to-transparent",
            iconBg: "bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]",
            changeColor: "text-emerald-400",
            href: "/requests",
        },
    ]

    const quickActions = [
        {
            title: "Add a Teaching Skill",
            description: "Share your expertise and earn tokens",
            icon: GraduationCap,
            href: "/skills/add",
            color: "from-purple-600 to-indigo-600",
        },
        {
            title: "Find Matches",
            description: "Discover teachers and students for you",
            icon: Zap,
            href: "/matches",
            color: "from-pink-600 to-rose-600",
        },
        {
            title: "Add Learning Goal",
            description: "Tell us what you want to master",
            icon: Sparkles,
            href: "/learn/add",
            color: "from-blue-600 to-cyan-600",
        },
    ]

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="animate-fade-in-up">
                <h1 className="text-3xl font-bold tracking-tight">
                    <span className="text-white">Hey, </span>
                    <span className="gradient-text-purple">{firstName}</span>
                    <span className="text-white"> 👋</span>
                </h1>
                <p className="mt-1 text-zinc-500 text-sm">Here&apos;s what&apos;s happening with your account today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat, i) => (
                    <Link key={stat.label} href={stat.href} className={`animate-fade-in-up delay-${(i + 1) * 100}`}>
                        <TiltCard className="rounded-2xl p-px glass-card group cursor-pointer">
                            <div className={`flex flex-col h-full justify-between rounded-2xl bg-gradient-to-br ${stat.gradient} p-5 transition-all`}>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider">{stat.label}</h3>
                                    <div className={`rounded-xl p-2 ${stat.iconBg}`}>
                                        <stat.icon className="h-4 w-4" />
                                    </div>
                                </div>
                                <div className="mt-3">
                                    {loading ? (
                                        <div className="skeleton h-8 w-16 mb-1" />
                                    ) : (
                                        <div className="text-3xl font-bold text-white tracking-tight">{stat.value}</div>
                                    )}
                                    <p className={`text-xs mt-1 font-medium ${stat.changeColor}`}>{loading ? '' : stat.change}</p>
                                </div>
                            </div>
                        </TiltCard>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="animate-fade-in-up delay-500">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-400" />
                    Quick Actions
                </h2>
                <div className="grid gap-3 md:grid-cols-3">
                    {quickActions.map((action) => (
                        <Link key={action.title} href={action.href}>
                            <div className="group rounded-2xl border border-white/[0.04] bg-white/[0.02] p-5 hover:bg-white/[0.04] hover:border-white/[0.08] transition-all cursor-pointer">
                                <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${action.color} mb-4`}>
                                    <action.icon className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="text-sm font-semibold text-white mb-1">{action.title}</h3>
                                <p className="text-xs text-zinc-500">{action.description}</p>
                                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-purple-400 group-hover:text-purple-300 transition-colors">
                                    Get started
                                    <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-2xl p-px glass-card animate-fade-in-up delay-600">
                <div className="rounded-2xl p-6">
                    <h2 className="mb-4 text-lg font-semibold text-white flex items-center gap-2">
                        <Activity className="h-5 w-5 text-purple-400" />
                        Recent Activity
                    </h2>
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="mb-4 rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/[0.04]">
                            <Activity className="h-8 w-8 text-zinc-700" />
                        </div>
                        <p className="text-sm text-zinc-400">No recent activity yet</p>
                        <p className="text-xs text-zinc-600 mt-1">Start by adding skills or finding matches!</p>
                        <Link href="/skills/add" className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors">
                            Add your first skill
                            <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
