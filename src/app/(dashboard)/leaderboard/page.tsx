'use client'

import { useEffect, useState } from 'react'
import { Trophy, Star, Flame, Users, BookOpen, GraduationCap, Loader2, Crown, Medal } from 'lucide-react'

interface LeaderUser {
    id: string
    name: string
    image?: string
    rating_avg: number
    location?: string
    totalSessions?: number
    _count: {
        teachSkills?: number
        sessionsAsTeacher?: number
        sessionsAsLearner?: number
    }
}

interface Stats {
    totalUsers: number
    totalSessions: number
    totalSkills: number
}

export default function LeaderboardPage() {
    const [topTeachers, setTopTeachers] = useState<LeaderUser[]>([])
    const [mostActive, setMostActive] = useState<LeaderUser[]>([])
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/leaderboard')
            .then(r => r.json())
            .then(data => {
                if (data.topTeachers) setTopTeachers(data.topTeachers)
                if (data.mostActive) setMostActive(data.mostActive)
                if (data.stats) setStats(data.stats)
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const rankIcons = [
        <Crown key="1" className="h-5 w-5 text-yellow-400" />,
        <Medal key="2" className="h-5 w-5 text-zinc-300" />,
        <Medal key="3" className="h-5 w-5 text-amber-600" />,
    ]

    if (loading) return (
        <div className="flex h-96 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        </div>
    )

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    <Trophy className="h-8 w-8 text-yellow-400" />
                    <span className="gradient-text-purple">Leaderboard</span>
                </h1>
                <p className="text-sm text-zinc-500 mt-1">Top performers in the SkillUNO community.</p>
            </div>

            {/* Platform Stats Bar */}
            {stats && (
                <div className="grid grid-cols-3 gap-3 animate-fade-in-up delay-100">
                    {[
                        { label: 'Community', value: stats.totalUsers, icon: Users, color: 'text-purple-400' },
                        { label: 'Sessions Done', value: stats.totalSessions, icon: Flame, color: 'text-orange-400' },
                        { label: 'Skills Listed', value: stats.totalSkills, icon: BookOpen, color: 'text-blue-400' },
                    ].map(s => (
                        <div key={s.label} className="rounded-2xl border border-white/[0.04] bg-white/[0.01] p-4 text-center">
                            <s.icon className={`h-5 w-5 mx-auto mb-2 ${s.color}`} />
                            <div className="text-2xl font-bold text-white">{s.value}</div>
                            <div className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Two Column Layout */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Top Rated Teachers */}
                <div className="rounded-2xl border border-white/[0.04] bg-white/[0.01] p-5 animate-fade-in-up delay-200">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        Top Rated Teachers
                    </h2>

                    {topTeachers.length === 0 ? (
                        <p className="text-sm text-zinc-600 py-8 text-center">No rated teachers yet. Be the first!</p>
                    ) : (
                        <div className="space-y-2">
                            {topTeachers.map((user, i) => (
                                <div
                                    key={user.id}
                                    className={`flex items-center gap-3 rounded-xl p-3 transition-all hover:bg-white/[0.03] ${i === 0 ? 'bg-gradient-to-r from-yellow-500/5 via-transparent to-transparent border border-yellow-500/10' : ''}`}
                                >
                                    <div className="w-6 text-center shrink-0">
                                        {i < 3 ? rankIcons[i] : <span className="text-xs text-zinc-600 font-bold">{i + 1}</span>}
                                    </div>
                                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-xs font-bold text-white overflow-hidden ring-2 ring-purple-500/20 shrink-0">
                                        {user.image ? (
                                            <img src={user.image} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                                        ) : (
                                            user.name?.charAt(0)?.toUpperCase() || '?'
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-white truncate">{user.name || 'User'}</p>
                                        <p className="text-[10px] text-zinc-500">
                                            {user._count.teachSkills || 0} skills • {user._count.sessionsAsTeacher || 0} sessions
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1 text-yellow-400">
                                        <Star className="h-3.5 w-3.5 fill-current" />
                                        <span className="text-sm font-bold">{user.rating_avg.toFixed(1)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Most Active */}
                <div className="rounded-2xl border border-white/[0.04] bg-white/[0.01] p-5 animate-fade-in-up delay-300">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Flame className="h-5 w-5 text-orange-400" />
                        Most Active
                    </h2>

                    {mostActive.length === 0 ? (
                        <p className="text-sm text-zinc-600 py-8 text-center">No activity yet. Start a session!</p>
                    ) : (
                        <div className="space-y-2">
                            {mostActive.map((user, i) => (
                                <div
                                    key={user.id}
                                    className={`flex items-center gap-3 rounded-xl p-3 transition-all hover:bg-white/[0.03] ${i === 0 ? 'bg-gradient-to-r from-orange-500/5 via-transparent to-transparent border border-orange-500/10' : ''}`}
                                >
                                    <div className="w-6 text-center shrink-0">
                                        {i < 3 ? rankIcons[i] : <span className="text-xs text-zinc-600 font-bold">{i + 1}</span>}
                                    </div>
                                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center text-xs font-bold text-white overflow-hidden ring-2 ring-orange-500/20 shrink-0">
                                        {user.image ? (
                                            <img src={user.image} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                                        ) : (
                                            user.name?.charAt(0)?.toUpperCase() || '?'
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-white truncate">{user.name || 'User'}</p>
                                        <p className="text-[10px] text-zinc-500">
                                            {user.totalSessions || 0} completed sessions
                                        </p>
                                    </div>
                                    {user.rating_avg > 0 && (
                                        <div className="flex items-center gap-1 text-yellow-400">
                                            <Star className="h-3 w-3 fill-current" />
                                            <span className="text-xs font-medium">{user.rating_avg.toFixed(1)}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
