'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, BookOpen, Clock, Globe, Loader2, Sparkles, GraduationCap, School } from 'lucide-react'
import { motion } from 'framer-motion'
import { TiltCard } from '@/components/ui/TiltCard'

interface Skill {
    id: string
    category: string
    skill_name: string
    level?: string // For teach
    desired_level?: string // For learn
    mode?: string // Teach
    mode_preference?: string // Learn
    experience?: number
    language?: string
    language_preference?: string
}

export default function SkillsPage() {
    const [activeTab, setActiveTab] = useState<'teach' | 'learn'>('teach')
    const [teachSkills, setTeachSkills] = useState<Skill[]>([])
    const [learnSkills, setLearnSkills] = useState<Skill[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const [teachRes, learnRes] = await Promise.all([
                    fetch('/api/skills/teach'),
                    fetch('/api/skills/learn')
                ])

                const teachData = await teachRes.json()
                const learnData = await learnRes.json()

                if (teachData.success) setTeachSkills(teachData.skills)
                if (Array.isArray(learnData)) setLearnSkills(learnData) // Learn API returns array directly

            } catch (error) {
                console.error("Failed to fetch skills", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    return (
        <div className="space-y-8 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Skill Management</h1>
                    <p className="mt-1 text-zinc-400">Manage what you teach and what you want to learn.</p>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2 rounded-full bg-zinc-900/50 p-1 border border-zinc-800">
                    <button
                        onClick={() => setActiveTab('teach')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'teach'
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                                : 'text-zinc-400 hover:text-white'
                            }`}
                    >
                        Teaching
                    </button>
                    <button
                        onClick={() => setActiveTab('learn')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'learn'
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                                : 'text-zinc-400 hover:text-white'
                            }`}
                    >
                        Learning
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Header Action */}
                    <div className="flex justify-end">
                        <Link
                            href={activeTab === 'teach' ? '/skills/add' : '/skills/learn/add'}
                            className={`flex items-center gap-2 rounded-full px-5 py-2.5 font-medium text-white shadow-lg transition-all hover:scale-105 ${activeTab === 'teach'
                                    ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-500/20'
                                    : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20'
                                }`}
                        >
                            <Plus className="h-5 w-5" />
                            {activeTab === 'teach' ? 'Add Teaching Skill' : 'Add Learning Goal'}
                        </Link>
                    </div>

                    {/* Content List */}
                    {(activeTab === 'teach' ? teachSkills : learnSkills).length === 0 ? (
                        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 text-center">
                            <div className={`mb-4 rounded-full p-4 ${activeTab === 'teach' ? 'bg-purple-900/20 text-purple-400' : 'bg-blue-900/20 text-blue-400'}`}>
                                {activeTab === 'teach' ? <School className="h-8 w-8" /> : <GraduationCap className="h-8 w-8" />}
                            </div>
                            <h3 className="text-lg font-medium text-white">
                                {activeTab === 'teach' ? 'No skills added yet' : 'No learning goals yet'}
                            </h3>
                            <p className="max-w-xs text-sm text-zinc-500 mt-2">
                                {activeTab === 'teach'
                                    ? 'Start sharing your expertise with the world.'
                                    : 'Set your first learning goal to match with mentors.'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {(activeTab === 'teach' ? teachSkills : learnSkills).map((skill) => (
                                <TiltCard key={skill.id} className="rounded-xl p-0.5 bg-zinc-800/50 glass-card">
                                    <div className="h-full rounded-xl bg-zinc-900/90 p-5 backdrop-blur-sm">

                                        {/* Card Header */}
                                        <div className="mb-4 flex items-start justify-between">
                                            <div className={`rounded-lg p-2.5 ${activeTab === 'teach' ? 'bg-purple-900/20 text-purple-400' : 'bg-blue-900/20 text-blue-400'
                                                }`}>
                                                {activeTab === 'teach' ? <BookOpen className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
                                            </div>
                                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium border ${(skill.mode || skill.mode_preference) === 'Online'
                                                    ? 'border-green-500/20 bg-green-500/10 text-green-400'
                                                    : 'border-yellow-500/20 bg-yellow-500/10 text-yellow-400'
                                                }`}>
                                                {skill.mode || skill.mode_preference || 'Any'}
                                            </span>
                                        </div>

                                        {/* Card Body */}
                                        <h3 className={`mb-1 text-lg font-semibold text-white transition-colors ${activeTab === 'teach' ? 'group-hover:text-purple-400' : 'group-hover:text-blue-400'
                                            }`}>
                                            {skill.skill_name}
                                        </h3>
                                        <p className="text-sm text-zinc-400 mb-4">{skill.category}</p>

                                        {/* Card Footer */}
                                        <div className="flex items-center gap-4 text-xs text-zinc-500 border-t border-white/5 pt-4 mt-auto">
                                            {activeTab === 'teach' && (
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    {skill.experience} Yrs Exp
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1.5">
                                                <Globe className="h-3.5 w-3.5" />
                                                {activeTab === 'teach' ? skill.level : `Target: ${skill.desired_level}`}
                                            </div>
                                        </div>
                                    </div>
                                </TiltCard>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
