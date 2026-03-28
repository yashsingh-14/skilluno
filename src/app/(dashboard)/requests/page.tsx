'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Check, X, Clock, Calendar, User, MessageSquare, Video, DollarSign } from 'lucide-react'
import { TiltCard } from '@/components/ui/TiltCard'
import ChatWindow from '@/components/dashboard/ChatWindow'
import { useToast } from '@/components/ui/Toast'

interface Session {
    id: string
    teacher_id: string
    learner_id: string
    status: 'pending' | 'scheduled' | 'cancelled' | 'completed' | 'verify_pending'
    scheduled_at: string
    initiated_by: string | null
    teacher: { id: string, name: string | null, image: string | null }
    learner: { id: string, name: string | null, image: string | null }
}

export default function RequestsPage() {
    const [sessions, setSessions] = useState<Session[]>([])
    const [userId, setUserId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [processing, setProcessing] = useState<string | null>(null)
    const [activeChat, setActiveChat] = useState<{ id: string, name: string, sessionId: string } | null>(null)
    const { toast } = useToast()

    useEffect(() => {
        fetchRequests()
    }, [])

    const fetchRequests = async () => {
        try {
            const res = await fetch('/api/requests?t=' + Date.now())
            const data = await res.json()
            if (data.sessions) {
                setSessions(data.sessions)
                setUserId(data.currentUserId)
            }
        } catch (error) {
            console.error("Failed to fetch requests", error)
        } finally {
            setLoading(false)
        }
    }

    const handleStatusUpdate = async (sessionId: string, status: 'scheduled' | 'cancelled') => {
        setProcessing(sessionId)
        try {
            const res = await fetch('/api/requests', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId, status })
            })

            if (res.ok) {
                setSessions(prev => prev.map(s =>
                    s.id === sessionId ? { ...s, status } : s
                ))
            }
        } catch (error) {
            console.error("Failed to update status", error)
        } finally {
            setProcessing(null)
        }
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
            </div>
        )
    }

    const incomingRequests = sessions.filter(s =>
        s.status === 'pending' &&
        (s.initiated_by ? s.initiated_by !== userId : true)
    )

    const outgoingRequests = sessions.filter(s =>
        s.status === 'pending' &&
        s.initiated_by === userId
    )

    const scheduledSessions = sessions.filter(s => s.status === 'scheduled')

    return (
        <div className="space-y-12 min-h-screen pb-20 relative">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                    Requests Inbox
                </h1>
                <p className="mt-1 text-zinc-400">
                    Manage your upcoming sessions and requests.
                </p>
            </div>

            {/* CHAT WINDOW OVERLAY */}
            <AnimatePresence>
                {activeChat && userId && (
                    <ChatWindow
                        currentUserId={userId}
                        otherUserId={activeChat.id}
                        otherUserName={activeChat.name}
                        onClose={() => setActiveChat(null)}
                        sessionId={activeChat.sessionId}
                        onStartCall={() => {
                            // Determine role based on session participants (we know current userId)
                            // But `activeChat` doesn't have session details directly... 
                            // Actually we can deduce it: if activeChat.id (other user) is the teacher, I am the learner? 
                            // Wait, activeChat is just `{id, name, sessionId}`.

                            // Better approach: We know valid logic from the "Join Call" button just below.
                            // But we need `isMeTeacher` context. 
                            // `sessions` is available in scope. 
                            const session = sessions.find(s => s.id === activeChat.sessionId)
                            if (session) {
                                const isMeTeacher = session.teacher_id === userId
                                const role = isMeTeacher ? 'teacher' : 'student' // 'student' matches CallPage logic (calls it 'student' not 'learner')
                                window.open(`/call/${activeChat.sessionId}?role=${role}`, '_blank')
                            }
                        }}
                    />
                )}
            </AnimatePresence>


            {/* INCOMING REQUESTS */}
            <section className="space-y-6">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
                    <h2 className="text-xl font-semibold text-white">Incoming Requests <span className="text-sm text-zinc-500 font-normal">(Respond to join)</span></h2>
                </div>

                {incomingRequests.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-zinc-800 p-8 text-center text-zinc-500">
                        No new requests.
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {incomingRequests.map(session => {
                            const isMeTeacher = session.teacher_id === userId
                            const otherUser = isMeTeacher ? session.learner : session.teacher
                            const roleLabel = isMeTeacher ? "Student Requesting" : "Teacher Invitation"

                            return (
                                <TiltCard key={session.id} className="rounded-xl p-0.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 glass-card">
                                    <div className="h-full rounded-xl bg-zinc-900/95 p-5 backdrop-blur-sm flex flex-col justify-between">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="h-12 w-12 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700">
                                                {otherUser.image ? <img src={otherUser.image} referrerPolicy="no-referrer" className="h-full w-full object-cover" /> : <User className="h-6 w-6 m-auto text-zinc-500" />}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-white">{otherUser.name || 'User'}</h4>
                                                <p className="text-xs text-yellow-500 uppercase tracking-wider">{roleLabel}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 mt-auto">
                                            <button
                                                onClick={() => handleStatusUpdate(session.id, 'scheduled')}
                                                disabled={!!processing}
                                                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-500 py-2 text-sm font-medium transition-colors border border-green-500/20"
                                            >
                                                {processing === session.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Check className="h-4 w-4" /> Accept</>}
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(session.id, 'cancelled')}
                                                disabled={!!processing}
                                                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 py-2 text-sm font-medium transition-colors border border-red-500/20"
                                            >
                                                <X className="h-4 w-4" /> Decline
                                            </button>
                                        </div>
                                    </div>
                                </TiltCard>
                            )
                        })}
                    </div>
                )}
            </section>

            {/* OUTGOING REQUESTS */}
            <section className="space-y-6">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <h2 className="text-xl font-semibold text-white">Sent Requests <span className="text-sm text-zinc-500 font-normal">(Waiting)</span></h2>
                </div>

                {outgoingRequests.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-zinc-800 p-8 text-center text-zinc-500">
                        No pending sent requests.
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {outgoingRequests.map(session => {
                            const isMeTeacher = session.teacher_id === userId
                            const otherUser = isMeTeacher ? session.learner : session.teacher
                            const roleLabel = isMeTeacher ? "Invited Student" : "Requested Teacher"

                            return (
                                <div key={session.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 flex flex-col gap-4 opacity-75 grayscale-[50%] hover:grayscale-0 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700">
                                            {otherUser.image ? <img src={otherUser.image} referrerPolicy="no-referrer" className="h-full w-full object-cover" /> : <User className="h-5 w-5 m-auto text-zinc-500" />}
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-white">{otherUser.name || 'User'}</h4>
                                            <p className="text-xs text-blue-400">{roleLabel}</p>
                                        </div>
                                    </div>
                                    <div className="rounded-lg bg-zinc-800/50 py-2 text-center text-xs font-medium text-zinc-400 border border-zinc-700/50">
                                        Waiting for their response...
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </section>

            {/* SCHEDULED SESSIONS */}
            <section className="space-y-6 pt-6 border-t border-zinc-800/50">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <h2 className="text-xl font-semibold text-white">Upcoming Sessions</h2>
                </div>

                {scheduledSessions.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-zinc-800 p-8 text-center text-zinc-500">
                        No upcoming sessions scheduled.
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {scheduledSessions.map(session => {
                            const isMeTeacher = session.teacher_id === userId
                            const otherUser = isMeTeacher ? session.learner : session.teacher

                            return (
                                <div key={session.id} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 flex flex-col gap-4 hover:bg-zinc-900 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700">
                                                {otherUser.image ? <img src={otherUser.image} referrerPolicy="no-referrer" className="h-full w-full object-cover" /> : <User className="h-5 w-5 m-auto text-zinc-500" />}
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-white">{otherUser.name || 'User'}</h4>
                                                <div className="flex items-center gap-2 text-xs text-green-400">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>{new Date(session.scheduled_at).toLocaleDateString()}</span>
                                                </div>
                                                <div className="text-[10px] uppercase tracking-wider font-mono text-zinc-500 mt-1">
                                                    Status: <span className={session.status === 'verify_pending' ? 'text-yellow-500 font-bold' : ''}>{session.status}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    {session.status === 'verify_pending' && (
                                        <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-xs font-semibold border border-yellow-500/20">
                                            Verify Pending
                                        </span>
                                    )}

                                    {/* Quick Actions Row */}
                                    <div className="flex items-center gap-2 mt-2">
                                        {/* 1. Chat Button */}
                                        <button
                                            onClick={() => setActiveChat({ id: otherUser.id, name: otherUser.name || 'User', sessionId: session.id })}
                                            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 py-2.5 text-sm active:scale-95 transition-all text-zinc-300 hover:text-white"
                                        >
                                            <MessageSquare className="h-4 w-4" /> Chat
                                        </button>

                                        {/* 2. Video Call Button (Always visible for scheduled/pending) */}
                                        {(session.status === 'scheduled' || session.status === 'verify_pending') && (
                                            <button
                                                onClick={() => {
                                                    // Add role to URL to ensure video component acts correctly
                                                    const role = isMeTeacher ? 'teacher' : 'learner'
                                                    window.open(`/call/${session.id}?role=${role}`, '_blank')
                                                }}
                                                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-purple-600/10 hover:bg-purple-600 hover:text-white border border-purple-600/20 py-2.5 text-sm active:scale-95 transition-all text-purple-400"
                                            >
                                                <Video className="h-4 w-4" /> Join Call
                                            </button>
                                        )}
                                    </div>

                                    {/* 3. Completion Actions (Context Aware) */}
                                    {
                                        session.status === 'scheduled' && isMeTeacher && (
                                            <button
                                                onClick={async () => {
                                                    if (confirm('Are you sure the session is done?')) {
                                                        const res = await fetch('/api/sessions/complete', {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({ sessionId: session.id, action: 'mark_complete' })
                                                        })
                                                        if (res.ok) {
                                                            toast('Session marked complete! Waiting for student verification.', 'success')
                                                            fetchRequests()
                                                        } else {
                                                            const data = await res.json()
                                                            toast(data.error || 'Request failed', 'error')
                                                        }
                                                    }
                                                }}
                                                className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
                                            >
                                                <Check className="h-4 w-4" /> Mark Complete
                                            </button>
                                        )
                                    }

                                    {
                                        session.status === 'verify_pending' && !isMeTeacher && (
                                            <button
                                                onClick={async () => {
                                                    if (confirm('Confirm completion and pay 40 tokens?')) {
                                                        const res = await fetch('/api/sessions/complete', {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({ sessionId: session.id, action: 'verify' })
                                                        })
                                                        if (res.ok) {
                                                            toast('Payment successful! Session completed. 🎉', 'success')
                                                            fetchRequests()
                                                        } else {
                                                            const data = await res.json()
                                                            toast(data.error || 'Request failed', 'error')
                                                        }
                                                    }
                                                }}
                                                className="w-full flex items-center justify-center gap-2 rounded-lg bg-green-600 hover:bg-green-500 py-2.5 text-sm font-bold text-white shadow-lg shadow-green-500/20 active:scale-95 transition-all animate-pulse"
                                            >
                                                <DollarSign className="h-4 w-4" /> Pay & Complete
                                            </button>
                                        )
                                    }

                                    {
                                        session.status === 'verify_pending' && isMeTeacher && (
                                            <div className="text-center text-xs text-zinc-500 italic">Waiting for student confirmation...</div>
                                        )
                                    }
                                </div>
                            )
                        })}
                    </div>
                )
                }
            </section >
        </div >
    )
}
