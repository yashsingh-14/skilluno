'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Peer from 'peerjs'
import { Loader2, Mic, MicOff, Video, VideoOff, PhoneOff, Copy } from 'lucide-react'

// Simple implementation:
// 1. User A (Caller) creates a room. Their Peer ID determines the room ID or is derived from it.
// 2. User B (Joiner) connects to that Peer ID.
// Challenge: PeerJS IDs must be known.
// Solution: We use the `sessionId` from URL as the "Room ID".
// However, PeerJS requires unique IDs.
// Strategy: 
// - Caller uses ID `skilluno-session-{sessionId}-teacher` (or user ID A)
// - Joiner uses ID `skilluno-session-{sessionId}-student` (or user ID B)
// - But wait, who calls whom?
// - Better: Both join with their own User ID. We use a side-channel (our existing chat/DB) to say "I am here".
// - Simpler for MVP: 
//   - URL: /call/[sessionId]?role=[teacher|student]
//   - Teacher Peer ID: `skilluno-{sessionId}-teacher`
//   - Student Peer ID: `skilluno-{sessionId}-student`
//   - If I am Teacher, I call Student. If Student is not there, retry.
//   - If I am Student, I listen. OR vice versa.

export default function VideoCall({ sessionId, role, userId }: { sessionId: string, role: string, userId: string }) {
    const router = useRouter()
    const [myStream, setMyStream] = useState<MediaStream | null>(null)
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
    const [peer, setPeer] = useState<Peer | null>(null)
    const [status, setStatus] = useState('Initializing...')
    const [muted, setMuted] = useState(false)
    const [videoOff, setVideoOff] = useState(false)

    const [incomingCall, setIncomingCall] = useState<any>(null) // To store the call object

    const myVideoRef = useRef<HTMLVideoElement>(null)
    const remoteVideoRef = useRef<HTMLVideoElement>(null)

    // IDs
    const myPeerId = `skilluno-${sessionId}-${role}` // e.g., skilluno-123-teacher
    const otherRole = role === 'teacher' ? 'student' : 'teacher'
    const targetPeerId = `skilluno-${sessionId}-${otherRole}`

    useEffect(() => {
        // 1. Get Local Stream
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                setMyStream(stream)
                if (myVideoRef.current) myVideoRef.current.srcObject = stream

                // 2. Initialize Peer
                const newPeer = new Peer(myPeerId)
                setPeer(newPeer)

                newPeer.on('open', (id) => {
                    setStatus(`Waiting for ${otherRole}...`)
                    // Try to connect automatically if we are the caller (optional logic)
                    // But for now, let's keep it simple: Wait for manual connection
                    connectToPeer(newPeer, stream)
                })

                newPeer.on('call', (call) => {
                    // INCOMING CALL LOGIC
                    setIncomingCall(call)
                    setStatus('Incoming Call...')
                })

                newPeer.on('error', (err) => {
                    console.error(err)
                    setStatus('Connection Error / Peer Not Found')
                })
            })
            .catch(err => {
                console.error("Failed to get media", err)
                setStatus('Camera/Microphone Permission Denied')
            })

        return () => {
            handleEndCall()
        }
    }, [])

    const connectToPeer = (currentPeer: Peer, stream: MediaStream) => {
        // Try to call the other person
        const call = currentPeer.call(targetPeerId, stream)

        if (call) {
            setStatus('Calling...')
            call.on('stream', (remoteStream) => {
                setRemoteStream(remoteStream)
                if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream
                setStatus('Connected')
            })
            call.on('close', () => {
                setStatus('Call Ended')
                setRemoteStream(null)
            })
            call.on('error', () => {
                // Retry?
                setTimeout(() => connectToPeer(currentPeer, stream), 3000)
            })
        }
    }

    const answerCall = () => {
        if (incomingCall && myStream) {
            incomingCall.answer(myStream)
            incomingCall.on('stream', (remoteStream: any) => {
                setRemoteStream(remoteStream)
                if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream
                setStatus('Connected')
            })
            setIncomingCall(null)
        }
    }

    const rejectCall = () => {
        if (incomingCall) {
            incomingCall.close()
            setIncomingCall(null)
            setStatus('Call Rejected')
        }
    }

    const handleEndCall = () => {
        myStream?.getTracks().forEach(track => track.stop())
        peer?.destroy()
        window.close() // Close the tab/window
    }

    // Manual Retry Button
    const retryConnection = () => {
        if (peer && myStream) connectToPeer(peer, myStream)
    }

    const toggleMute = () => {
        if (myStream) {
            myStream.getAudioTracks().forEach(track => track.enabled = !muted)
            setMuted(!muted)
        }
    }

    const toggleVideo = () => {
        if (myStream) {
            myStream.getVideoTracks().forEach(track => track.enabled = !videoOff)
            setVideoOff(!videoOff)
        }
    }

    return (
        <div className="flex h-screen flex-col bg-black text-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-zinc-900 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${status === 'Connected' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
                    <span className="font-mono text-sm">{status}</span>
                    <span className="text-xs text-zinc-600 ml-2">({myPeerId})</span>
                </div>
                <button onClick={handleEndCall} className="text-zinc-400 hover:text-white">
                    Close
                </button>
            </div>

            {/* Video Grid */}
            <div className="flex-1 relative flex items-center justify-center p-4">
                {/* INCOMING CALL OVERLAY */}
                {incomingCall && (
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
                        <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 text-center space-y-6">
                            <div className="h-20 w-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                                <Video className="h-8 w-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold">Incoming Call...</h2>
                            <div className="flex gap-4">
                                <button
                                    onClick={answerCall}
                                    className="px-8 py-3 bg-green-500 hover:bg-green-600 rounded-full font-bold flex items-center gap-2"
                                >
                                    <Video className="h-5 w-5" /> Accept
                                </button>
                                <button
                                    onClick={rejectCall}
                                    className="px-8 py-3 bg-red-500 hover:bg-red-600 rounded-full font-bold flex items-center gap-2"
                                >
                                    <PhoneOff className="h-5 w-5" /> Decline
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Remote Video (Full Size) */}
                {remoteStream ? (
                    <video ref={remoteVideoRef} autoPlay className="h-full w-full object-contain rounded-2xl bg-zinc-900" />
                ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center bg-zinc-900 rounded-2xl border border-dashed border-zinc-800 text-zinc-500 gap-4">
                        <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
                        <p>Waiting for the other person to join...</p>
                        <button onClick={retryConnection} className="text-sm text-purple-400 hover:underline">
                            Click here to retry connection
                        </button>
                    </div>
                )}

                {/* My Video (PiP) */}
                <div className="absolute bottom-8 right-8 w-48 h-36 bg-zinc-800 rounded-xl overflow-hidden border-2 border-zinc-700 shadow-2xl">
                    <video ref={myVideoRef} autoPlay muted className="h-full w-full object-cover" />
                    {videoOff && <div className="absolute inset-0 flex items-center justify-center bg-zinc-800 text-zinc-500">Video Off</div>}
                </div>
            </div>

            {/* Controls */}
            <div className="p-6 bg-zinc-900 flex justify-center gap-4">
                <button onClick={toggleMute} className={`p-4 rounded-full ${muted ? 'bg-red-500' : 'bg-zinc-700 hover:bg-zinc-600'}`}>
                    {muted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                </button>
                <button onClick={toggleVideo} className={`p-4 rounded-full ${videoOff ? 'bg-red-500' : 'bg-zinc-700 hover:bg-zinc-600'}`}>
                    {videoOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
                </button>
                <button onClick={handleEndCall} className="p-4 rounded-full bg-red-600 hover:bg-red-700">
                    <PhoneOff className="h-6 w-6" />
                </button>
            </div>
        </div>
    )
}
