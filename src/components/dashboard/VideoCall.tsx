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
                    // Manual connection only now
                })

                newPeer.on('call', (call) => {
                    // INCOMING CALL LOGIC
                    setIncomingCall(call)
                    setStatus('Incoming Call...')
                    playRingtone('incoming') // START RINGING
                })

                newPeer.on('error', (err: any) => {
                    console.error(err)
                    if (err.type === 'unavailable-id') {
                        setStatus('Connection busy, retrying...')
                        setTimeout(() => {
                            if (!newPeer.destroyed) newPeer.destroy()
                            // Refetch logic or reload is safer for full reset, but recursive init is tricky in useEffect.
                            // Simplest dev fix: just reload page if stuck, or wait.
                            // Better: use a random suffix if sticky. 
                            // BUT for our logic, ID must be exact.
                            // So let's just ask user to reload if it persists.
                            setStatus('Connection zombie detected. Reloading...')
                            setTimeout(() => window.location.reload(), 1000)
                        }, 2000)
                    } else {
                        setStatus('Connection Error / Peer Not Found')
                    }
                })
            })
            .catch(err => {
                console.error("Failed to get media", err)
                setStatus('Camera/Microphone Permission Denied')
            })

        return () => {
            cleanupCall()
        }
    }, [])

    const connectToPeer = (currentPeer: Peer, stream: MediaStream) => {
        // Try to call the other person
        setStatus('Calling...')
        playRingtone('outgoing') // START DIALING TONE

        const call = currentPeer.call(targetPeerId, stream)
        setCallObject(call)

        if (call) {
            call.on('stream', (remoteStream) => {
                stopRingtone() // STOP TONE ON CONNECT
                setRemoteStream(remoteStream)
                if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream
                setStatus('Connected')
            })
            call.on('close', () => {
                stopRingtone()
                setStatus('Call Ended')
                setRemoteStream(null)
                setCallObject(null)
            })
            call.on('error', () => {
                // Retry?
                // stopRingtone() // Keep ringing if just a glitch? No, stop.
                // setTimeout(() => connectToPeer(currentPeer, stream), 3000)
            })
        }
    }

    const answerCall = () => {
        stopRingtone() // STOP RINGING
        if (incomingCall && myStream) {
            incomingCall.answer(myStream)
            setCallObject(incomingCall)

            incomingCall.on('stream', (remoteStream: any) => {
                setRemoteStream(remoteStream)
                if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream
                setStatus('Connected')
            })

            incomingCall.on('close', () => {
                setStatus('Call Ended')
                setRemoteStream(null)
                setCallObject(null)
                setIncomingCall(null)
            })

            setIncomingCall(null)
        }
    }

    const rejectCall = () => {
        stopRingtone() // STOP RINGING
        if (incomingCall) {
            incomingCall.close()
            setIncomingCall(null)
            setStatus('Call Rejected')
        }
    }

    // Cleanup function (without closing window)
    const cleanupCall = () => {
        stopRingtone()
        if (callObject) callObject.close()
        if (incomingCall) incomingCall.close()

        myStream?.getTracks().forEach(track => track.stop())
        peer?.destroy()
    }

    const handleEndCall = () => {
        cleanupCall()
        // Determine if we should close the window or just show "Call Ended"
        // User asked for "Cut System".
        // Let's just reload the page or close window depending on context.
        // For dashboard flow, closing tab is standard.
        // But let's verify if user wants to stay.
        // Close window is safest to ensure Peer destroy.
        window.close()
    }

    // Manual Retry Button
    const retryConnection = () => {
        if (peer && myStream) connectToPeer(peer, myStream)
    }

    const [callObject, setCallObject] = useState<any>(null) // Store active outgoing/connected call

    // Audio Refs for Ringing
    const audioCtxRef = useRef<AudioContext | null>(null);
    const oscillatorRef = useRef<OscillatorNode | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Sound Logic: Web Audio API (No files needed)
    const playRingtone = (type: 'incoming' | 'outgoing') => {
        stopRingtone(); // Ensure clean start
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();
            audioCtxRef.current = ctx;
            const gainNode = ctx.createGain();
            gainNode.connect(ctx.destination);
            gainNodeRef.current = gainNode;

            if (type === 'incoming') {
                // Classic Phone Ring: Trrring... Trrring...
                const playBeep = () => {
                    if (ctx.state === 'closed') return;
                    const osc = ctx.createOscillator();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(800, ctx.currentTime);
                    osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.1); // Modulation
                    osc.connect(gainNode);
                    osc.start();
                    osc.stop(ctx.currentTime + 1.5); // Long ring
                    oscillatorRef.current = osc;
                };
                playBeep();
                intervalRef.current = setInterval(playBeep, 3000);
                gainNode.gain.value = 0.5;
            } else {
                // Outgoing: Beep... Beep...
                const playTone = () => {
                    if (ctx.state === 'closed') return;
                    const osc = ctx.createOscillator();
                    osc.type = 'sine';
                    osc.frequency.value = 440;
                    osc.connect(gainNode);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.8);
                    oscillatorRef.current = osc;
                };
                playTone();
                intervalRef.current = setInterval(playTone, 2000);
                gainNode.gain.value = 0.2;
            }
        } catch (e) {
            console.error("Audio error", e)
        }
    }

    const stopRingtone = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (oscillatorRef.current) {
            try { oscillatorRef.current.stop(); } catch (e) { }
        }
        if (audioCtxRef.current) {
            audioCtxRef.current.close();
        }
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
                {/* Permission Error State */}
                {status.includes('Permission Denied') ? (
                    <div className="h-full w-full flex flex-col items-center justify-center bg-zinc-900 rounded-2xl border border-red-900/50 gap-6 p-8 text-center">
                        <div className="h-20 w-20 bg-red-500/10 rounded-full flex items-center justify-center animate-pulse">
                            <VideoOff className="h-10 w-10 text-red-500" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-red-500">Camera Access Blocked</h3>
                            <p className="text-zinc-400 max-w-md">
                                Please allow camera and microphone access to join the call.
                            </p>
                        </div>
                        <div className="text-sm text-zinc-500 bg-black/50 p-4 rounded-lg text-left space-y-2">
                            <p>1. Click the 🔒 <span className="text-white font-bold">Lock Icon</span> in your browser URL bar.</p>
                            <p>2. Toggle <span className="text-white font-bold">Camera</span> & <span className="text-white font-bold">Microphone</span> to 'Allow'.</p>
                            <p>3. Refresh this page.</p>
                        </div>
                        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-full transition-colors">
                            Refresh Page
                        </button>
                    </div>
                ) : remoteStream ? (
                    <video ref={remoteVideoRef} autoPlay className="h-full w-full object-contain rounded-2xl bg-zinc-900" />
                ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center bg-zinc-900 rounded-2xl border border-dashed border-zinc-800 text-zinc-500 gap-4">
                        <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
                        <p>Waiting for the other person to join...</p>
                        <p className="text-xs text-zinc-600 max-w-xs text-center">
                            Make sure the other person is also on this page.
                        </p>

                        {/* Explicit Call Button for everyone to ensure connection triggers */}
                        <button
                            onClick={retryConnection}
                            className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-full font-bold transition-all shadow-lg hover:shadow-purple-500/20 active:scale-95"
                        >
                            Connect To Peer
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
