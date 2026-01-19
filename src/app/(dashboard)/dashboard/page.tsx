'use client'

import { TiltCard } from "@/components/ui/TiltCard"
import { Wallet, BookOpen, Star, Calendar, Activity } from "lucide-react"

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-zinc-400 bg-clip-text text-transparent tracking-tight">Dashboard Overview</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <TiltCard className="rounded-2xl bg-zinc-900/40 p-1 glass-card group">
                    <div className="flex flex-col h-full justify-between rounded-xl bg-gradient-to-br from-purple-900/10 via-zinc-900/50 to-zinc-900/80 p-6 transition-all group-hover:from-purple-900/20">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-zinc-400">Token Balance</h3>
                            <div className="rounded-full bg-purple-500/10 p-2 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                                <Wallet className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="text-3xl font-bold text-white tracking-tight">100</div>
                            <p className="text-xs text-purple-400 mt-1 font-medium">+10 this week</p>
                        </div>
                    </div>
                </TiltCard>

                <TiltCard className="rounded-2xl bg-zinc-900/40 p-1 glass-card group">
                    <div className="flex flex-col h-full justify-between rounded-xl bg-gradient-to-br from-blue-900/10 via-zinc-900/50 to-zinc-900/80 p-6 transition-all group-hover:from-blue-900/20">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-zinc-400">Sessions</h3>
                            <div className="rounded-full bg-blue-500/10 p-2 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                                <BookOpen className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="text-3xl font-bold text-white tracking-tight">0</div>
                            <p className="text-xs text-blue-400 mt-1 font-medium">Start learning activity</p>
                        </div>
                    </div>
                </TiltCard>

                <TiltCard className="rounded-2xl bg-zinc-900/40 p-1 glass-card group">
                    <div className="flex flex-col h-full justify-between rounded-xl bg-gradient-to-br from-yellow-900/10 via-zinc-900/50 to-zinc-900/80 p-6 transition-all group-hover:from-yellow-900/20">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-zinc-400">Avg Rating</h3>
                            <div className="rounded-full bg-yellow-500/10 p-2 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.15)]">
                                <Star className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="text-3xl font-bold text-white tracking-tight">5.0</div>
                            <p className="text-xs text-yellow-400 mt-1 font-medium">Based on 0 reviews</p>
                        </div>
                    </div>
                </TiltCard>

                <TiltCard className="rounded-2xl bg-zinc-900/40 p-1 glass-card group">
                    <div className="flex flex-col h-full justify-between rounded-xl bg-gradient-to-br from-emerald-900/10 via-zinc-900/50 to-zinc-900/80 p-6 transition-all group-hover:from-emerald-900/20">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-zinc-400">Upcoming</h3>
                            <div className="rounded-full bg-emerald-500/10 p-2 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                                <Calendar className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="text-3xl font-bold text-white tracking-tight">0</div>
                            <p className="text-xs text-emerald-400 mt-1 font-medium">Next session scheduled</p>
                        </div>
                    </div>
                </TiltCard>
            </div>

            <div className="rounded-2xl p-0.5 bg-gradient-to-b from-zinc-800 to-zinc-900/0 glass-card">
                <div className="rounded-[15px] bg-zinc-900/40 p-8 backdrop-blur-md">
                    <h2 className="mb-4 text-xl font-bold text-white flex items-center gap-2">
                        <Activity className="h-5 w-5 text-purple-400" />
                        Recent Activity
                    </h2>
                    <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
                        <div className="mb-4 rounded-full bg-zinc-800/50 p-4 ring-1 ring-white/5 shadow-inner">
                            <Activity className="h-8 w-8 text-zinc-600" />
                        </div>
                        <p className="text-zinc-400">No recent activity.</p>
                        <p className="text-sm text-zinc-600 mt-1">Start by exploring skills or teaching!</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
