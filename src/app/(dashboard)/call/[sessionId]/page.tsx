'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import VideoCall from '@/components/dashboard/VideoCall'
import { Loader2 } from 'lucide-react'

export default function CallPage() {
    const params = useParams()
    const sessionId = params.sessionId as string
    const [role, setRole] = useState<string | null>(null)
    const [userId, setUserId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Fetch session to determine role
        fetch(`/api/sessions/detail?sessionId=${sessionId}`)
            .then(res => res.json())
            .then(data => {
                if (data.session && data.currentUserId) {
                    setUserId(data.currentUserId)
                    // Determine role
                    if (data.currentUserId === data.session.teacher_id) {
                        setRole('teacher')
                    } else if (data.currentUserId === data.session.learner_id) {
                        setRole('student')
                    }
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [sessionId])

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-black text-white">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-purple-600" />
                    <p>Connecting to secure room...</p>
                </div>
            </div>
        )
    }

    if (!role || !userId) {
        return (
            <div className="flex h-screen items-center justify-center bg-black text-white">
                <p>Access Denied: You are not a participant of this session.</p>
            </div>
        )
    }

    return <VideoCall sessionId={sessionId} role={role} userId={userId} />
}
