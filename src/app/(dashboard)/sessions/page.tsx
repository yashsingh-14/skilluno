'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useToast } from '@/components/ui/Toast'
import { Check, X, CheckCircle, Loader2, Video, Star, MessageSquare, Calendar, Clock, Coins } from 'lucide-react'
import Link from 'next/link'

interface SessionData {
    id: string
    teacher_id: string
    learner_id: string
    scheduled_at: string
    status: string
    tokens_used: number
    teacher: { name: string, email: string, image?: string }
    learner: { name: string, email: string, image?: string }
    review?: { rating: number, comment: string } | null
}

const STATUS_CONFIG: Record<string, { color: string, bg: string, label: string }> = {
    pending: { color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', label: 'Pending' },
    accepted: { color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', label: 'Accepted' },
    scheduled: { color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', label: 'Scheduled' },
    completed: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', label: 'Completed' },
    rejected: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', label: 'Rejected' },
    cancelled: { color: 'text-zinc-400', bg: 'bg-zinc-500/10 border-zinc-500/20', label: 'Cancelled' },
    verify_pending: { color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', label: 'Verify Pending' },
}

export default function SessionsPage() {
    const { data: authSession } = useSession()
    const { toast } = useToast()
    const [sessions, setSessions] = useState<SessionData[]>([])
    const [loading, setLoading] = useState(true)
    const [reviewModal, setReviewModal] = useState<string | null>(null)
    const [reviewRating, setReviewRating] = useState(5)
    const [reviewComment, setReviewComment] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const fetchSessions = () => {
        fetch('/api/sessions')
            .then(res => res.json())
            .then(data => {
                if (data.sessions) setSessions(data.sessions)
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchSessions()
    }, [])

    const handleAction = async (session_id: string, action: string) => {
        try {
            const res = await fetch('/api/sessions/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session_id, action })
            })
            if (res.ok) {
                toast(action === 'accept' ? 'Session accepted!' : action === 'reject' ? 'Session rejected' : 'Session completed!', action === 'reject' ? 'warning' : 'success')
                fetchSessions()
            } else {
                toast('Action failed', 'error')
            }
        } catch (e) {
            toast('Something went wrong', 'error')
        }
    }

    const submitReview = async () => {
        if (!reviewModal) return
        setSubmitting(true)
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    session_id: reviewModal,
                    rating: reviewRating,
                    comment: reviewComment
                })
            })
            if (res.ok) {
                toast('Review submitted! ⭐', 'success')
                setReviewModal(null)
                setReviewRating(5)
                setReviewComment('')
                fetchSessions()
            } else {
                const data = await res.json()
                toast(data.error || 'Review failed', 'error')
            }
        } catch (e) {
            toast('Something went wrong', 'error')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return (
        <div className="flex h-96 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                <span className="text-xs text-zinc-600">Loading sessions...</span>
            </div>
        </div>
    )

    const currentEmail = authSession?.user?.email

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div>
                <h1 className="text-3xl font-bold tracking-tight gradient-text-purple">My Sessions</h1>
                <p className="text-sm text-zinc-500 mt-1">Track your 1-on-1 learning and teaching sessions.</p>
            </div>

            {sessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="rounded-2xl bg-white/[0.03] p-5 ring-1 ring-white/[0.04] mb-4">
                        <Calendar className="h-10 w-10 text-zinc-700" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">No sessions yet</h3>
                    <p className="text-sm text-zinc-500 max-w-md mb-4">
                        Request a session from the Matches page to get started!
                    </p>
                    <Link href="/matches" className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors">
                        Find matches →
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {sessions.map((session, i) => {
                        const isMeTeacher = session.teacher?.email === currentEmail
                        const otherPerson = isMeTeacher ? session.learner : session.teacher
                        const myRole = isMeTeacher ? 'Teacher' : 'Learner'
                        const statusConfig = STATUS_CONFIG[session.status] || STATUS_CONFIG.pending

                        return (
                            <div
                                key={session.id}
                                className="rounded-2xl border border-white/[0.04] bg-white/[0.01] p-5 hover:bg-white/[0.03] hover:border-white/[0.06] transition-all animate-fade-in-up"
                                style={{ animationDelay: `${i * 60}ms` }}
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    {/* Left: User info + details */}
                                    <div className="flex items-start gap-4">
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-sm font-bold text-white overflow-hidden ring-2 ring-purple-500/20 shrink-0">
                                            {otherPerson?.image ? (
                                                <img src={otherPerson.image} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                                            ) : (
                                                otherPerson?.name?.charAt(0)?.toUpperCase() || '?'
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-base font-semibold text-white">{otherPerson?.name || 'User'}</h3>
                                            <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-zinc-500">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${statusConfig.bg} ${statusConfig.color}`}>
                                                    {statusConfig.label}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {new Date(session.scheduled_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} at {new Date(session.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Coins className="h-3 w-3" />
                                                    {session.tokens_used} tokens
                                                </span>
                                                <span className="text-zinc-600">You: {myRole}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Actions */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        {session.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleAction(session.id, 'accept')}
                                                    className="flex items-center gap-1.5 rounded-xl bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all active:scale-[0.98]"
                                                >
                                                    <Check className="h-3.5 w-3.5" /> Accept
                                                </button>
                                                <button
                                                    onClick={() => handleAction(session.id, 'reject')}
                                                    className="flex items-center gap-1.5 rounded-xl bg-red-500/10 px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all active:scale-[0.98]"
                                                >
                                                    <X className="h-3.5 w-3.5" /> Reject
                                                </button>
                                            </>
                                        )}

                                        {(session.status === 'accepted' || session.status === 'scheduled') && (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        const role = isMeTeacher ? 'teacher' : 'student'
                                                        window.open(`/call/${session.id}?role=${role}`, '_blank')
                                                    }}
                                                    className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-500 transition-all active:scale-[0.98] shadow-lg shadow-purple-600/20"
                                                >
                                                    <Video className="h-3.5 w-3.5" /> Join Call
                                                </button>
                                                {isMeTeacher && (
                                                    <button
                                                        onClick={() => handleAction(session.id, 'complete')}
                                                        className="flex items-center gap-1.5 rounded-xl bg-blue-500/10 px-4 py-2 text-xs font-bold text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition-all active:scale-[0.98]"
                                                    >
                                                        <CheckCircle className="h-3.5 w-3.5" /> Complete
                                                    </button>
                                                )}
                                            </>
                                        )}

                                        {session.status === 'completed' && !session.review && (
                                            <button
                                                onClick={() => setReviewModal(session.id)}
                                                className="flex items-center gap-1.5 rounded-xl bg-yellow-500/10 px-4 py-2 text-xs font-bold text-yellow-400 hover:bg-yellow-500/20 border border-yellow-500/20 transition-all active:scale-[0.98] animate-pulse-glow"
                                            >
                                                <Star className="h-3.5 w-3.5" /> Leave Review
                                            </button>
                                        )}

                                        {session.review && (
                                            <div className="flex items-center gap-1 text-xs text-yellow-400">
                                                {Array.from({ length: session.review.rating }).map((_, j) => (
                                                    <Star key={j} className="h-3.5 w-3.5 fill-current" />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Review Modal */}
            {reviewModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setReviewModal(null)} />
                    <div className="relative w-full max-w-md animate-scale-in">
                        <div className="gradient-border rounded-2xl">
                            <div className="rounded-2xl bg-zinc-950 p-6 space-y-5">
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-white">Rate this session</h3>
                                    <p className="text-sm text-zinc-500 mt-1">How was your experience?</p>
                                </div>

                                {/* Star Rating */}
                                <div className="flex justify-center gap-2">
                                    {[1, 2, 3, 4, 5].map(n => (
                                        <button
                                            key={n}
                                            onClick={() => setReviewRating(n)}
                                            className="transition-transform hover:scale-110 active:scale-95"
                                        >
                                            <Star
                                                className={`h-8 w-8 ${n <= reviewRating
                                                    ? 'fill-yellow-500 text-yellow-500'
                                                    : 'text-zinc-700'
                                                    } transition-colors`}
                                            />
                                        </button>
                                    ))}
                                </div>

                                {/* Comment */}
                                <textarea
                                    value={reviewComment}
                                    onChange={e => setReviewComment(e.target.value)}
                                    placeholder="Share your thoughts (optional)..."
                                    rows={3}
                                    className="input-premium resize-none"
                                />

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setReviewModal(null)}
                                        className="flex-1 rounded-xl bg-white/[0.05] px-4 py-3 text-sm font-medium text-zinc-400 hover:bg-white/[0.08] transition-all border border-white/[0.06]"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={submitReview}
                                        disabled={submitting}
                                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-600 to-orange-600 px-4 py-3 text-sm font-bold text-white hover:from-yellow-500 hover:to-orange-500 transition-all disabled:opacity-50 active:scale-[0.98]"
                                    >
                                        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Star className="h-4 w-4" /> Submit Review</>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
