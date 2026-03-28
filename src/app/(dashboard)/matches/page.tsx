'use client'

import { useEffect, useState } from 'react'
import { Loader2, Users, ArrowRight, Star, MapPin, Sparkles, GraduationCap } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

interface TeacherMatch {
    learning_goal: any
    offered_by: { id: string, skill_name: string, user: any }[]
}

interface StudentMatch {
    teaching_skill: any
    requested_by: { id: string, skill_name: string, user: any }[]
}

export default function MatchesPage() {
    const [loading, setLoading] = useState(true)
    const [teachers, setTeachers] = useState<TeacherMatch[]>([])
    const [students, setStudents] = useState<StudentMatch[]>([])
    const [requesting, setRequesting] = useState<string | null>(null)
    const { toast } = useToast()

    useEffect(() => {
        fetch('/api/matches')
            .then(r => r.json())
            .then(data => {
                if (data.matches) {
                    setTeachers(data.matches.teachers || [])
                    setStudents(data.matches.students || [])
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const requestSession = async (targetUserId: string, skillName: string, role: 'learner' | 'teacher') => {
        setRequesting(targetUserId)
        try {
            const res = await fetch('/api/sessions/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetUserId, skillName, role })
            })
            const data = await res.json()
            if (data.success) {
                toast('Session requested! 🎉', 'success')
            } else {
                toast(data.error || 'Failed', 'error')
            }
        } catch (e) {
            toast('Error requesting session', 'error')
        } finally {
            setRequesting(null)
        }
    }

    if (loading) return (
        <div className="flex h-96 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                <span className="text-xs text-zinc-600">Finding your matches...</span>
            </div>
        </div>
    )

    const hasMatches = teachers.length > 0 || students.length > 0

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    <span className="gradient-text-purple">Skill Matches</span>
                </h1>
                <p className="mt-1 text-sm text-zinc-500">People matched based on your skills and learning goals.</p>
            </div>

            {!hasMatches ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="rounded-2xl bg-white/[0.03] p-5 ring-1 ring-white/[0.04] mb-4">
                        <Users className="h-10 w-10 text-zinc-700" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">No matches found</h3>
                    <p className="text-sm text-zinc-500 max-w-md">
                        Add your teaching skills and learning goals to start finding perfect matches.
                    </p>
                </div>
            ) : (
                <>
                    {/* Teachers for Me */}
                    {teachers.length > 0 && (
                        <div>
                            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <GraduationCap className="h-5 w-5 text-blue-400" />
                                Teachers for You
                                <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full font-medium">{teachers.reduce((a, t) => a + t.offered_by.length, 0)}</span>
                            </h2>
                            <div className="space-y-4">
                                {teachers.map((group, gi) => (
                                    <div key={gi}>
                                        <p className="text-xs text-zinc-500 mb-3 uppercase tracking-wider font-medium">
                                            Learning: <span className="text-zinc-300">{group.learning_goal.skill_name}</span>
                                        </p>
                                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                            {group.offered_by.map((teacher, ti) => (
                                                <div
                                                    key={teacher.user.id}
                                                    className="group rounded-2xl border border-white/[0.04] bg-white/[0.01] p-5 hover:bg-white/[0.03] hover:border-white/[0.08] transition-all animate-fade-in-up"
                                                    style={{ animationDelay: `${ti * 100}ms` }}
                                                >
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white overflow-hidden ring-2 ring-blue-500/20">
                                                            {teacher.user.image ? (
                                                                <img src={teacher.user.image} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                                                            ) : (
                                                                teacher.user.name?.charAt(0)?.toUpperCase() || '?'
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold text-white truncate">{teacher.user.name}</p>
                                                            <div className="flex items-center gap-2 text-xs text-zinc-500">
                                                                {teacher.user.rating_avg > 0 && (
                                                                    <span className="flex items-center gap-0.5 text-yellow-400">
                                                                        <Star className="h-3 w-3 fill-current" />
                                                                        {teacher.user.rating_avg.toFixed(1)}
                                                                    </span>
                                                                )}
                                                                {teacher.user.location && (
                                                                    <span className="flex items-center gap-0.5">
                                                                        <MapPin className="h-3 w-3" />
                                                                        {teacher.user.location}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => requestSession(teacher.user.id, group.learning_goal.skill_name, 'learner')}
                                                        disabled={requesting === teacher.user.id}
                                                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600/80 to-indigo-600/80 px-4 py-2.5 text-xs font-bold text-white hover:from-purple-500 hover:to-indigo-500 transition-all disabled:opacity-50 active:scale-[0.98]"
                                                    >
                                                        {requesting === teacher.user.id ? (
                                                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                        ) : (
                                                            <>
                                                                Request Session
                                                                <ArrowRight className="h-3.5 w-3.5" />
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Students for Me */}
                    {students.length > 0 && (
                        <div>
                            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-pink-400" />
                                Students for You
                                <span className="text-xs bg-pink-500/10 text-pink-400 px-2 py-0.5 rounded-full font-medium">{students.reduce((a, s) => a + s.requested_by.length, 0)}</span>
                            </h2>
                            <div className="space-y-4">
                                {students.map((group, gi) => (
                                    <div key={gi}>
                                        <p className="text-xs text-zinc-500 mb-3 uppercase tracking-wider font-medium">
                                            Teaching: <span className="text-zinc-300">{group.teaching_skill.skill_name}</span>
                                        </p>
                                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                            {group.requested_by.map((student, si) => (
                                                <div
                                                    key={student.user.id}
                                                    className="group rounded-2xl border border-white/[0.04] bg-white/[0.01] p-5 hover:bg-white/[0.03] hover:border-white/[0.08] transition-all animate-fade-in-up"
                                                    style={{ animationDelay: `${si * 100}ms` }}
                                                >
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center text-xs font-bold text-white overflow-hidden ring-2 ring-pink-500/20">
                                                            {student.user.image ? (
                                                                <img src={student.user.image} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                                                            ) : (
                                                                student.user.name?.charAt(0)?.toUpperCase() || '?'
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold text-white truncate">{student.user.name}</p>
                                                            <div className="flex items-center gap-2 text-xs text-zinc-500">
                                                                {student.user.rating_avg > 0 && (
                                                                    <span className="flex items-center gap-0.5 text-yellow-400">
                                                                        <Star className="h-3 w-3 fill-current" />
                                                                        {student.user.rating_avg.toFixed(1)}
                                                                    </span>
                                                                )}
                                                                {student.user.location && (
                                                                    <span className="flex items-center gap-0.5">
                                                                        <MapPin className="h-3 w-3" />
                                                                        {student.user.location}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => requestSession(student.user.id, group.teaching_skill.skill_name, 'teacher')}
                                                        disabled={requesting === student.user.id}
                                                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600/80 to-rose-600/80 px-4 py-2.5 text-xs font-bold text-white hover:from-pink-500 hover:to-rose-500 transition-all disabled:opacity-50 active:scale-[0.98]"
                                                    >
                                                        {requesting === student.user.id ? (
                                                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                        ) : (
                                                            <>
                                                                Offer to Teach
                                                                <ArrowRight className="h-3.5 w-3.5" />
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
