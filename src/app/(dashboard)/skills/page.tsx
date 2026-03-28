'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Loader2, BookOpen, GraduationCap, ArrowRight } from 'lucide-react'

type TeachSkill = {
    id: string
    category: string
    skill_name: string
    level: string
    experience: number
    mode: string
    language: string
}

type LearnSkill = {
    id: string
    category: string
    skill_name: string
    desired_level: string
    mode_preference: string
    language_preference: string
}

const CATEGORY_COLORS: Record<string, string> = {
    Academics: 'bg-blue-500/10 text-blue-400 ring-blue-500/20',
    Music: 'bg-pink-500/10 text-pink-400 ring-pink-500/20',
    Programming: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20',
    Coding: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20',
    Language: 'bg-yellow-500/10 text-yellow-400 ring-yellow-500/20',
    Art: 'bg-rose-500/10 text-rose-400 ring-rose-500/20',
    Design: 'bg-indigo-500/10 text-indigo-400 ring-indigo-500/20',
    Fitness: 'bg-orange-500/10 text-orange-400 ring-orange-500/20',
    Cooking: 'bg-amber-500/10 text-amber-400 ring-amber-500/20',
    Other: 'bg-zinc-500/10 text-zinc-400 ring-zinc-500/20',
}

export default function SkillsPage() {
    const [tab, setTab] = useState<'teach' | 'learn'>('teach')
    const [teachSkills, setTeachSkills] = useState<TeachSkill[]>([])
    const [learnSkills, setLearnSkills] = useState<LearnSkill[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            fetch('/api/skills/teach').then(r => r.json()),
            fetch('/api/skills/learn').then(r => r.json())
        ]).then(([teachData, learnData]) => {
            if (teachData.skills) setTeachSkills(teachData.skills)
            if (Array.isArray(learnData)) setLearnSkills(learnData)
        }).catch(console.error).finally(() => setLoading(false))
    }, [])

    if (loading) return (
        <div className="flex h-96 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                <span className="text-xs text-zinc-600">Loading your skills...</span>
            </div>
        </div>
    )

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight gradient-text-purple">My Skills</h1>
                    <p className="text-sm text-zinc-500 mt-1">Manage your teaching skills and learning goals.</p>
                </div>
                <Link
                    href={tab === 'teach' ? '/skills/add' : '/learn/add'}
                    className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition-all hover:shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:scale-[1.02] active:scale-[0.98]"
                >
                    <Plus className="h-4 w-4" />
                    Add {tab === 'teach' ? 'Skill' : 'Goal'}
                </Link>
            </div>

            {/* Tab Switcher */}
            <div className="flex gap-1 rounded-xl p-1 bg-white/[0.03] border border-white/[0.04] w-fit">
                <button
                    className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all ${tab === 'teach'
                        ? 'bg-gradient-to-r from-purple-600/90 to-indigo-600/90 text-white shadow-lg'
                        : 'text-zinc-500 hover:text-white hover:bg-white/[0.04]'
                        }`}
                    onClick={() => setTab('teach')}
                >
                    <GraduationCap className="h-4 w-4" />
                    Teaching
                    <span className={`text-xs rounded-full px-2 py-0.5 ${tab === 'teach' ? 'bg-white/20' : 'bg-zinc-800'}`}>
                        {teachSkills.length}
                    </span>
                </button>
                <button
                    className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all ${tab === 'learn'
                        ? 'bg-gradient-to-r from-blue-600/90 to-cyan-600/90 text-white shadow-lg'
                        : 'text-zinc-500 hover:text-white hover:bg-white/[0.04]'
                        }`}
                    onClick={() => setTab('learn')}
                >
                    <BookOpen className="h-4 w-4" />
                    Learning
                    <span className={`text-xs rounded-full px-2 py-0.5 ${tab === 'learn' ? 'bg-white/20' : 'bg-zinc-800'}`}>
                        {learnSkills.length}
                    </span>
                </button>
            </div>

            {/* Content */}
            {tab === 'teach' ? (
                <div>
                    {teachSkills.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="rounded-2xl bg-white/[0.03] p-5 ring-1 ring-white/[0.04] mb-4">
                                <GraduationCap className="h-10 w-10 text-zinc-700" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-1">No teaching skills yet</h3>
                            <p className="text-sm text-zinc-500 mb-4 max-w-md">
                                Add the skills you can teach to start earning tokens.
                            </p>
                            <Link href="/skills/add" className="inline-flex items-center gap-1.5 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors">
                                Add your first skill <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                            {teachSkills.map((skill, i) => (
                                <div
                                    key={skill.id}
                                    className="group rounded-2xl border border-white/[0.04] bg-white/[0.01] p-5 hover:bg-white/[0.03] hover:border-white/[0.08] transition-all animate-fade-in-up"
                                    style={{ animationDelay: `${i * 80}ms` }}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset ${CATEGORY_COLORS[skill.category] || CATEGORY_COLORS.Other}`}>
                                            {skill.category}
                                        </span>
                                        <span className="text-[10px] text-zinc-600 font-medium uppercase tracking-wider">{skill.mode}</span>
                                    </div>
                                    <h3 className="text-base font-bold text-white mb-2">{skill.skill_name}</h3>
                                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                                        <span className="flex items-center gap-1">
                                            Level: <span className="text-zinc-300">{skill.level}</span>
                                        </span>
                                        {skill.experience > 0 && (
                                            <span className="flex items-center gap-1">
                                                {skill.experience}y exp
                                            </span>
                                        )}
                                    </div>
                                    {skill.language && (
                                        <p className="mt-2 text-[11px] text-zinc-600">🌐 {skill.language}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    {learnSkills.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="rounded-2xl bg-white/[0.03] p-5 ring-1 ring-white/[0.04] mb-4">
                                <BookOpen className="h-10 w-10 text-zinc-700" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-1">No learning goals yet</h3>
                            <p className="text-sm text-zinc-500 mb-4 max-w-md">
                                Add what you want to learn and we&apos;ll find teachers for you.
                            </p>
                            <Link href="/learn/add" className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
                                Add a learning goal <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                            {learnSkills.map((skill, i) => (
                                <div
                                    key={skill.id}
                                    className="group rounded-2xl border border-white/[0.04] bg-white/[0.01] p-5 hover:bg-white/[0.03] hover:border-white/[0.08] transition-all animate-fade-in-up"
                                    style={{ animationDelay: `${i * 80}ms` }}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset ${CATEGORY_COLORS[skill.category] || CATEGORY_COLORS.Other}`}>
                                            {skill.category}
                                        </span>
                                        <span className="text-[10px] text-zinc-600 font-medium uppercase tracking-wider">{skill.mode_preference}</span>
                                    </div>
                                    <h3 className="text-base font-bold text-white mb-2">{skill.skill_name}</h3>
                                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                                        <span>Target: <span className="text-zinc-300">{skill.desired_level}</span></span>
                                    </div>
                                    {skill.language_preference && (
                                        <p className="mt-2 text-[11px] text-zinc-600">🌐 {skill.language_preference}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
