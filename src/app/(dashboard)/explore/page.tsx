'use client'

import { useEffect, useState } from 'react'
import { Search, Star, MapPin, Loader2, GraduationCap, Filter, Globe, Sparkles } from 'lucide-react'

interface Skill {
    id: string
    skill_name: string
    category: string
    level: string
    experience: number
    mode: string
    language: string
    user: {
        id: string
        name: string
        image?: string
        rating_avg: number
        location?: string
    }
}

const CATEGORY_COLORS: Record<string, string> = {
    Academics: 'bg-blue-500/10 text-blue-400 ring-blue-500/20',
    Music: 'bg-pink-500/10 text-pink-400 ring-pink-500/20',
    Programming: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20',
    Coding: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20',
    Language: 'bg-yellow-500/10 text-yellow-400 ring-yellow-500/20',
    Design: 'bg-indigo-500/10 text-indigo-400 ring-indigo-500/20',
    Fitness: 'bg-orange-500/10 text-orange-400 ring-orange-500/20',
    Cooking: 'bg-amber-500/10 text-amber-400 ring-amber-500/20',
    Other: 'bg-zinc-500/10 text-zinc-400 ring-zinc-500/20',
}

export default function ExplorePage() {
    const [skills, setSkills] = useState<Skill[]>([])
    const [categories, setCategories] = useState<string[]>([])
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)

    const fetchSkills = (cat?: string, q?: string) => {
        setLoading(true)
        const params = new URLSearchParams()
        if (cat && cat !== 'All') params.set('category', cat)
        if (q) params.set('q', q)

        fetch(`/api/explore?${params}`)
            .then(r => r.json())
            .then(data => {
                if (data.skills) setSkills(data.skills)
                if (data.categories) setCategories(data.categories)
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchSkills()
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchSkills(selectedCategory, search)
        }, 300)
        return () => clearTimeout(timer)
    }, [selectedCategory, search])

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div>
                <h1 className="text-3xl font-bold tracking-tight gradient-text-purple">Explore Skills</h1>
                <p className="text-sm text-zinc-500 mt-1">Browse all available teachers and skills in the community.</p>
            </div>

            {/* Search + Filter Bar */}
            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search skills, e.g. Python, Guitar..."
                        className="input-premium pl-10 w-full"
                    />
                </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${selectedCategory === cat
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                            : 'bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Results */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                </div>
            ) : skills.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="rounded-2xl bg-white/[0.03] p-5 ring-1 ring-white/[0.04] mb-4">
                        <Sparkles className="h-10 w-10 text-zinc-700" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">No skills found</h3>
                    <p className="text-sm text-zinc-500">Try a different search or category.</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {skills.map((skill, i) => (
                        <div
                            key={skill.id}
                            className="group rounded-2xl border border-white/[0.04] bg-white/[0.01] p-5 hover:bg-white/[0.03] hover:border-white/[0.08] transition-all animate-fade-in-up"
                            style={{ animationDelay: `${i * 50}ms` }}
                        >
                            {/* Teacher info */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white overflow-hidden ring-2 ring-purple-500/20">
                                    {skill.user.image ? (
                                        <img src={skill.user.image} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                                    ) : (
                                        skill.user.name?.charAt(0)?.toUpperCase() || '?'
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-white truncate">{skill.user.name}</p>
                                    <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                                        {skill.user.rating_avg > 0 && (
                                            <span className="flex items-center gap-0.5 text-yellow-400">
                                                <Star className="h-3 w-3 fill-current" />
                                                {skill.user.rating_avg.toFixed(1)}
                                            </span>
                                        )}
                                        {skill.user.location && (
                                            <span className="flex items-center gap-0.5">
                                                <MapPin className="h-3 w-3" />
                                                {skill.user.location}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Skill info */}
                            <div className="flex items-center justify-between mb-2">
                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset ${CATEGORY_COLORS[skill.category] || CATEGORY_COLORS.Other}`}>
                                    {skill.category}
                                </span>
                                <span className="text-[10px] text-zinc-600 font-medium uppercase">{skill.mode}</span>
                            </div>

                            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                                <GraduationCap className="h-4 w-4 text-purple-400" />
                                {skill.skill_name}
                            </h3>

                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-500">
                                <span>Level: <span className="text-zinc-300">{skill.level}</span></span>
                                {skill.experience > 0 && <span>• {skill.experience}y exp</span>}
                                {skill.language && (
                                    <span className="flex items-center gap-0.5">
                                        <Globe className="h-3 w-3" />
                                        {skill.language}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Results count */}
            {!loading && skills.length > 0 && (
                <p className="text-center text-xs text-zinc-600">
                    Showing {skills.length} skill{skills.length !== 1 ? 's' : ''}
                </p>
            )}
        </div>
    )
}
