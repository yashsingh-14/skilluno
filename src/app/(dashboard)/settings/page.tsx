'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useToast } from '@/components/ui/Toast'
import { User, Mail, MapPin, Globe, Star, Loader2, Save, LogOut, Shield, Trash2, Crown, Calendar } from 'lucide-react'

interface Profile {
    id: string
    name: string
    email: string
    image?: string
    languages?: string
    location?: string
    rating_avg: number
    created_at: string
    _count: {
        teachSkills: number
        learnSkills: number
        sessionsAsTeacher: number
        sessionsAsLearner: number
    }
}

export default function SettingsPage() {
    const { data: session } = useSession()
    const { toast } = useToast()
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    // Editable fields
    const [name, setName] = useState('')
    const [location, setLocation] = useState('')
    const [languages, setLanguages] = useState('')

    useEffect(() => {
        fetch('/api/profile')
            .then(r => r.json())
            .then(data => {
                if (data.user) {
                    setProfile(data.user)
                    setName(data.user.name || '')
                    setLocation(data.user.location || '')
                    setLanguages(data.user.languages || '')
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const handleSave = async () => {
        setSaving(true)
        try {
            const res = await fetch('/api/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, location, languages })
            })
            if (res.ok) {
                toast('Profile updated! ✨', 'success')
            } else {
                toast('Failed to update', 'error')
            }
        } catch (e) {
            toast('Something went wrong', 'error')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return (
        <div className="flex h-96 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        </div>
    )

    const totalSessions = (profile?._count.sessionsAsTeacher || 0) + (profile?._count.sessionsAsLearner || 0)
    const memberSince = profile ? new Date(profile.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : ''

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight gradient-text-purple">Settings</h1>
                <p className="text-sm text-zinc-500 mt-1">Manage your profile and preferences.</p>
            </div>

            {/* Profile Card */}
            <div className="rounded-2xl border border-white/[0.04] bg-white/[0.01] p-6 animate-fade-in-up delay-100">
                <div className="flex items-center gap-5 mb-6">
                    <div className="relative">
                        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-2xl font-bold text-white overflow-hidden ring-4 ring-purple-500/20">
                            {profile?.image ? (
                                <img src={profile.image} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                                profile?.name?.charAt(0)?.toUpperCase() || '?'
                            )}
                        </div>
                        {profile?.rating_avg && profile.rating_avg > 0 && (
                            <div className="absolute -bottom-1 -right-1 flex items-center gap-0.5 rounded-full bg-zinc-900 border border-yellow-500/30 px-1.5 py-0.5">
                                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                <span className="text-[10px] font-bold text-yellow-400">{profile.rating_avg.toFixed(1)}</span>
                            </div>
                        )}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">{profile?.name}</h2>
                        <p className="text-sm text-zinc-500">{profile?.email}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-zinc-500">
                            <span className="flex items-center gap-1 text-purple-400">
                                <Crown className="h-3 w-3" />
                                {profile?._count.teachSkills || 0} teaching • {profile?._count.learnSkills || 0} learning
                            </span>
                            <span>{totalSessions} sessions</span>
                            <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Since {memberSince}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Editable Fields */}
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5 block">Display Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="input-premium pl-10 w-full"
                                placeholder="Your name"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5 block">Location</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                            <input
                                type="text"
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                                className="input-premium pl-10 w-full"
                                placeholder="City, Country"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5 block">Languages</label>
                        <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                            <input
                                type="text"
                                value={languages}
                                onChange={e => setLanguages(e.target.value)}
                                className="input-premium pl-10 w-full"
                                placeholder="English, Hindi, Marathi..."
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white hover:from-purple-500 hover:to-indigo-500 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-purple-600/20"
                    >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {/* Account Section */}
            <div className="rounded-2xl border border-white/[0.04] bg-white/[0.01] p-6 space-y-4 animate-fade-in-up delay-200">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Shield className="h-4 w-4 text-zinc-400" />
                    Account
                </h3>

                <div className="flex items-center justify-between rounded-xl bg-white/[0.02] px-4 py-3 border border-white/[0.04]">
                    <div>
                        <p className="text-sm font-medium text-white">Email</p>
                        <p className="text-xs text-zinc-500">{profile?.email}</p>
                    </div>
                    <Mail className="h-4 w-4 text-zinc-600" />
                </div>

                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-white/[0.04] px-4 py-3 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-all border border-white/[0.06]"
                >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </button>
            </div>

            {/* Danger Zone */}
            <div className="rounded-2xl border border-red-500/10 bg-red-500/[0.02] p-6 animate-fade-in-up delay-300">
                <h3 className="text-sm font-semibold text-red-400 flex items-center gap-2 mb-3">
                    <Trash2 className="h-4 w-4" />
                    Danger Zone
                </h3>
                <p className="text-xs text-zinc-500 mb-3">Once you delete your account, there is no going back.</p>
                <button
                    className="rounded-xl bg-red-500/10 px-4 py-2 text-xs font-medium text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all"
                    onClick={() => toast('Account deletion coming soon', 'info')}
                >
                    Delete Account
                </button>
            </div>
        </div>
    )
}
