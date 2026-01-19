'use client'

import { useEffect, useState } from 'react'
import { Check, X, CheckCircle, Loader2, Video } from 'lucide-react'

// Reuse type or import if available
interface Session {
    id: string
    teacher_id: string
    learner_id: string
    scheduled_at: string
    status: string
    tokens_used: number
    teacher: { name: string, email: string }
    learner: { name: string, email: string }
}

export default function SessionsPage() {
    const [sessions, setSessions] = useState<Session[]>([])
    const [loading, setLoading] = useState(true)

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
                fetchSessions()
            } else {
                alert('Action failed')
            }
        } catch (e) {
            console.error(e)
        }
    }

    if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-purple-500" /></div>

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">My Sessions</h1>

            {sessions.length === 0 ? (
                <div className="rounded-xl border border-dashed border-zinc-800 p-12 text-center text-zinc-500">
                    No sessions found. Request a session from the Matches page!
                </div>
            ) : (
                <div className="grid gap-4">
                    {sessions.map((session) => (
                        <div key={session.id} className="flex flex-col md:flex-row items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">

                            <div className="mb-4 md:mb-0">
                                <div className="flex items-center gap-2">
                                    <span className={`inline-block size-2 rounded-full ${session.status === 'accepted' ? 'bg-green-500' :
                                            session.status === 'pending' ? 'bg-yellow-500' :
                                                session.status === 'completed' ? 'bg-blue-500' : 'bg-red-500'
                                        }`} />
                                    <span className="text-sm font-medium uppercase text-zinc-400">{session.status}</span>
                                </div>
                                <h3 className="mt-1 text-lg font-bold">
                                    {new Date(session.scheduled_at).toLocaleDateString()} at {new Date(session.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </h3>
                                <p className="text-sm text-zinc-400">
                                    With: <span className="text-white">{session.teacher.name} (Teacher)</span>
                                </p>
                                <div className="mt-2 text-xs text-zinc-500">Tokens: {session.tokens_used}</div>
                            </div>

                            <div className="flex gap-3">
                                {/* Actions based on state (simplified view, assumes user is one or the other) */}
                                {session.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => handleAction(session.id, 'accept')}
                                            className="flex items-center gap-1 rounded-md bg-green-600/20 px-4 py-2 text-sm font-medium text-green-500 hover:bg-green-600/30"
                                        >
                                            <Check className="h-4 w-4" /> Accept
                                        </button>
                                        <button
                                            onClick={() => handleAction(session.id, 'reject')}
                                            className="flex items-center gap-1 rounded-md bg-red-600/20 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-600/30"
                                        >
                                            <X className="h-4 w-4" /> Reject
                                        </button>
                                    </>
                                )}

                                {session.status === 'accepted' && (
                                    <button
                                        onClick={() => handleAction(session.id, 'complete')}
                                        className="flex items-center gap-1 rounded-md bg-blue-600/20 px-4 py-2 text-sm font-medium text-blue-500 hover:bg-blue-600/30"
                                    >
                                        <CheckCircle className="h-4 w-4" /> Mark Complete
                                    </button>
                                )}

                                {session.status === 'accepted' && (
                                    <button className="flex items-center gap-1 rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">
                                        <Video className="h-4 w-4" /> Join
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
