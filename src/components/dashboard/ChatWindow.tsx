'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, X, Loader2, Video, CheckCircle, AlertCircle, DollarSign } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
    id: string
    content: string
    senderId: string
    created_at: string
}

interface ChatWindowProps {
    currentUserId: string
    otherUserId: string
    otherUserName: string
    onClose: () => void
    onStartCall?: () => void
    sessionId: string // Added sessionId
}

export default function ChatWindow({ currentUserId, otherUserId, otherUserName, onClose, onStartCall, sessionId }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)

    // New State for Completion Logic
    const [sessionStatus, setSessionStatus] = useState<string | null>(null)
    const [myRole, setMyRole] = useState<'teacher' | 'learner' | null>(null)
    const [actionLoading, setActionLoading] = useState(false)

    const messagesEndRef = useRef<HTMLDivElement>(null)

    const fetchMessages = async () => {
        try {
            const res = await fetch(`/api/messages?targetUserId=${otherUserId}`)
            const data = await res.json()
            if (data.messages) {
                setMessages(data.messages)
            }
        } catch (error) {
            console.error("Error fetching messages", error)
        } finally {
            setLoading(false)
        }
    }

    const fetchSessionDetails = async () => {
        try {
            const res = await fetch(`/api/sessions/detail?sessionId=${sessionId}`)
            const data = await res.json()
            if (data.session) {
                setSessionStatus(data.session.status)
                if (data.session.teacher_id === currentUserId) setMyRole('teacher')
                else if (data.session.learner_id === currentUserId) setMyRole('learner')
            }
        } catch (error) {
            console.error("Error fetching session status", error)
        }
    }

    // Initial fetch and Polling
    useEffect(() => {
        fetchMessages()
        fetchSessionDetails()
        const interval = setInterval(() => {
            fetchMessages()
            fetchSessionDetails()
        }, 3000)
        return () => clearInterval(interval)
    }, [otherUserId, sessionId])

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        setSending(true)
        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    receiverId: otherUserId,
                    content: newMessage
                })
            })

            if (res.ok) {
                setNewMessage('')
                fetchMessages() // Refresh immediately
            }
        } catch (error) {
            console.error("Error sending message", error)
        } finally {
            setSending(false)
        }
    }

    const startVideoCall = async () => {
        if (onStartCall) onStartCall()
    }

    const handleAction = async (action: 'mark_complete' | 'verify') => {
        setActionLoading(true)
        try {
            const res = await fetch('/api/sessions/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId, action })
            })
            const data = await res.json()
            if (data.success) {
                fetchSessionDetails() // Refresh UI
            } else {
                alert("Action failed: " + (data.error || 'Unknown error'))
            }
        } catch (error) {
            console.error("Action error", error)
        } finally {
            setActionLoading(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-4 right-4 z-50 w-80 sm:w-96 h-[550px] flex flex-col bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden glass"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-zinc-800/80 backdrop-blur-sm border-b border-zinc-700">
                <div>
                    <h3 className="font-semibold text-white">{otherUserName}</h3>
                    <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-xs text-zinc-400">Online</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={startVideoCall}
                        className="p-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white transition-colors"
                        title="Start Video Call"
                    >
                        <Video className="h-4 w-4" />
                    </button>
                    <button onClick={onClose} className="p-1 hover:bg-zinc-700 rounded-full text-zinc-400 hover:text-white transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* COMPLETION ACTIONS */}
            {sessionStatus !== 'cancelled' && sessionStatus !== 'pending' && (
                <div className="px-4 py-2 bg-zinc-800/50 border-b border-zinc-800">
                    {/* CASE 1: Teacher can Mark Complete */}
                    {sessionStatus === 'scheduled' && myRole === 'teacher' && (
                        <button
                            onClick={() => handleAction('mark_complete')}
                            disabled={actionLoading}
                            className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white py-2 text-sm font-medium transition-colors"
                        >
                            {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                            Mark Session Complete
                        </button>
                    )}

                    {/* CASE 2: Learner must Verify */}
                    {sessionStatus === 'verify_pending' && myRole === 'learner' && (
                        <button
                            onClick={() => handleAction('verify')}
                            disabled={actionLoading}
                            className="w-full flex items-center justify-center gap-2 rounded-lg bg-green-600 hover:bg-green-500 text-white py-2 text-sm font-medium transition-colors animate-pulse"
                        >
                            {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <DollarSign className="h-4 w-4" />}
                            Confirm & Pay Tokens
                        </button>
                    )}

                    {/* CASE 3: Waiting for Learner */}
                    {sessionStatus === 'verify_pending' && myRole === 'teacher' && (
                        <div className="text-center text-xs text-yellow-500 flex items-center justify-center gap-2">
                            <AlertCircle className="h-3 w-3" /> Waiting for student verification...
                        </div>
                    )}

                    {/* CASE 4: Completed */}
                    {sessionStatus === 'completed' && (
                        <div className="text-center text-xs text-green-500 flex items-center justify-center gap-2 font-medium">
                            <CheckCircle className="h-3 w-3" /> Session Completed
                        </div>
                    )}
                </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-900/50">
                {loading ? (
                    <div className="flex h-full items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center text-zinc-500 text-sm">
                        <p>No messages yet.</p>
                        <p>Say hello! 👋</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.senderId === currentUserId
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${isMe
                                        ? 'bg-purple-600 text-white rounded-br-none'
                                        : 'bg-zinc-800 text-zinc-200 rounded-bl-none'
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        )
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-3 bg-zinc-800/80 border-t border-zinc-700 backdrop-blur-sm">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-zinc-900 border border-zinc-700 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 placeholder-zinc-500"
                    />
                    <button
                        type="submit"
                        disabled={sending || !newMessage.trim()}
                        className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                    >
                        {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    </button>
                </div>
            </form>
        </motion.div>
    )
}
