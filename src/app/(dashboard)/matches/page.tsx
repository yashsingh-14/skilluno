'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Loader2, User, Star, MapPin, MessageSquare, Zap, School, GraduationCap, Globe, Clock, CheckCircle } from 'lucide-react'
import { TiltCard } from '@/components/ui/TiltCard'
import { useRouter } from 'next/navigation'

interface MatchedUser {
    id: string
    name: string | null
    image: string | null
    rating_avg: number
    location: string | null
}

interface TeacherMatch {
    learning_goal: { id: string, skill_name: string }
    offered_by: {
        id: string
        skill_name: string
        level: string
        experience: number
        mode: string
        user: MatchedUser
    }[]
}

interface StudentMatch {
    teaching_skill: { id: string, skill_name: string }
    requested_by: {
        id: string
        skill_name: string
        desired_level: string
        mode_preference: string
        user: MatchedUser
    }[]
}

export default function MatchesPage() {
    const [matches, setMatches] = useState<{ teachers: TeacherMatch[], students: StudentMatch[] }>({ teachers: [], students: [] })
    const [loading, setLoading] = useState(true)
    const [requesting, setRequesting] = useState<string | null>(null) // ID of user being requested
    const router = useRouter()

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const res = await fetch('/api/matches')
                const data = await res.json()
                if (data.matches) {
                    setMatches(data.matches)
                }
            } catch (error) {
                console.error("Failed to fetch matches", error)
            } finally {
                setLoading(false)
            }
        }
        fetchMatches()
    }, [])

    const handleRequestSession = async (targetUserId: string, skillName: string, myRole: 'teacher' | 'learner') => {
        setRequesting(targetUserId)
        try {
            const res = await fetch('/api/sessions/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    targetUserId,
                    skillName,
                    role: myRole
                })
            })

            const data = await res.json()
            if (res.ok) {
                alert('Session Requested Successfully!') // Replace with toast later
                router.push('/dashboard')
            } else {
                alert(data.error || 'Failed to request session')
            }
        } catch (error) {
            console.error("Request failed", error)
        } finally {
            setRequesting(null)
        }
    }

    const hasTeachers = matches.teachers.length > 0
    const hasStudents = matches.students.length > 0
    const isEmpty = !hasTeachers && !hasStudents

    return (
        <div className="space-y-12 min-h-screen pb-20">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                    Your Perfect Matches
                </h1>
                <p className="mt-1 text-zinc-400">
                    Connect with teachers and students based on your skills.
                </p>
            </div>

            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
                </div>
            ) : isEmpty ? (
                <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 text-center">
                    <div className="mb-4 rounded-full bg-zinc-800/50 p-4 text-pink-500">
                        <Zap className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-medium text-white">No matches found yet</h3>
                    <p className="max-w-xs text-sm text-zinc-500 mt-2">
                        Try adding more skills or learning goals to find people.
                    </p>
                </div>
            ) : (
                <div className="space-y-16">

                    {/* SECTION 1: TEACHERS FOR ME */}
                    {hasTeachers && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                <School className="text-purple-400" />
                                Teachers for You
                            </h2>
                            {matches.teachers.map((group) => (
                                <div key={group.learning_goal.id} className="space-y-4">
                                    <div className="flex items-center gap-2 text-sm text-zinc-500 pl-1">
                                        For: <span className="text-white">{group.learning_goal.skill_name}</span>
                                    </div>
                                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        {group.offered_by.map((offer) => (
                                            <TiltCard key={offer.id} className="rounded-xl p-0.5 bg-gradient-to-b from-purple-900/50 to-zinc-900 glass-card">
                                                <div className="h-full rounded-xl bg-zinc-900/90 p-5 backdrop-blur-sm relative overflow-hidden flex flex-col">

                                                    {/* Profile */}
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="h-12 w-12 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700">
                                                            {offer.user.image ? <img src={offer.user.image} className="h-full w-full object-cover" /> : <User className="h-full w-full p-2.5 text-zinc-500" />}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-white">{offer.user.name || 'Anonymous User'}</h4>
                                                            <div className="flex items-center gap-1 text-xs text-yellow-500">
                                                                <Star className="h-3 w-3 fill-current" />
                                                                <span>{offer.user.rating_avg > 0 ? offer.user.rating_avg.toFixed(1) : 'New'}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Teacher Details (Restored) */}
                                                    <div className="mb-6 space-y-2 border-t border-zinc-800 pt-4 flex-grow">
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-zinc-500 flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5" /> Level</span>
                                                            <span className="text-zinc-200">{offer.level}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-zinc-500 flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> Experience</span>
                                                            <span className="text-zinc-200">{offer.experience} Yrs</span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-zinc-500 flex items-center gap-2"><Globe className="h-3.5 w-3.5" /> Mode</span>
                                                            <span className="text-zinc-200">{offer.mode}</span>
                                                        </div>
                                                        {offer.user.location && (
                                                            <div className="flex items-center justify-between text-sm">
                                                                <span className="text-zinc-500 flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> Location</span>
                                                                <span className="text-zinc-200 truncate max-w-[120px]">{offer.user.location}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <button
                                                        onClick={() => handleRequestSession(offer.user.id, offer.skill_name, 'learner')}
                                                        disabled={requesting === offer.user.id}
                                                        className="w-full rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black hover:bg-zinc-200 disabled:opacity-50 transition-colors"
                                                    >
                                                        {requesting === offer.user.id ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Request matched Teacher'}
                                                    </button>
                                                </div>
                                            </TiltCard>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* SECTION 2: STUDENTS FOR ME */}
                    {hasStudents && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                <GraduationCap className="text-blue-400" />
                                Potential Students
                            </h2>
                            {matches.students.map((group) => (
                                <div key={group.teaching_skill.id} className="space-y-4">
                                    <div className="flex items-center gap-2 text-sm text-zinc-500 pl-1">
                                        For: <span className="text-white">{group.teaching_skill.skill_name}</span>
                                    </div>
                                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        {group.requested_by.map((req) => (
                                            <TiltCard key={req.id} className="rounded-xl p-0.5 bg-gradient-to-b from-blue-900/50 to-zinc-900 glass-card">
                                                <div className="h-full rounded-xl bg-zinc-900/90 p-5 backdrop-blur-sm relative overflow-hidden flex flex-col">

                                                    {/* Profile */}
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="h-12 w-12 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700">
                                                            {req.user.image ? <img src={req.user.image} className="h-full w-full object-cover" /> : <User className="h-full w-full p-2.5 text-zinc-500" />}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-white">{req.user.name || 'Anonymous User'}</h4>
                                                            <div className="flex items-center gap-1 text-xs text-blue-400 font-medium">
                                                                Student
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Student Details (Restored) */}
                                                    <div className="mb-6 space-y-2 border-t border-zinc-800 pt-4 flex-grow">
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-zinc-500 flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5" /> Goal</span>
                                                            <span className="text-zinc-200">{req.desired_level}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-zinc-500 flex items-center gap-2"><Globe className="h-3.5 w-3.5" /> Preference</span>
                                                            <span className="text-zinc-200">{req.mode_preference}</span>
                                                        </div>
                                                        {req.user.location && (
                                                            <div className="flex items-center justify-between text-sm">
                                                                <span className="text-zinc-500 flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> Location</span>
                                                                <span className="text-zinc-200 truncate max-w-[120px]">{req.user.location}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <button
                                                        onClick={() => handleRequestSession(req.user.id, req.skill_name, 'teacher')}
                                                        disabled={requesting === req.user.id}
                                                        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50 transition-colors"
                                                    >
                                                        {requesting === req.user.id ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Offer to Teach'}
                                                    </button>
                                                </div>
                                            </TiltCard>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            )}
        </div>
    )
}
