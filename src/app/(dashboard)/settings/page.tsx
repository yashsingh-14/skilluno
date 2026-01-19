'use client'

import { useSession, signOut } from "next-auth/react"
import { LogOut, User, Mail, Shield, Bell, Moon } from "lucide-react"
import { TiltCard } from "@/components/ui/TiltCard"

export default function SettingsPage() {
    const { data: session } = useSession()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">Settings</h1>
                <p className="text-zinc-400">Manage your account preferences and settings.</p>
            </div>

            {/* Profile Section */}
            <TiltCard className="rounded-2xl bg-zinc-900/40 p-1 glass-card">
                <div className="rounded-xl bg-gradient-to-br from-zinc-800/30 to-zinc-900/30 p-6 backdrop-blur-sm">
                    <h2 className="mb-4 text-lg font-bold text-white tracking-tight">Profile</h2>
                    <div className="flex items-center gap-6">
                        <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                            {session?.user?.image ? (
                                <img
                                    src={session.user.image}
                                    alt={session.user.name || "Profile"}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-zinc-800">
                                    <User className="h-8 w-8 text-zinc-400" />
                                </div>
                            )}
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-2xl font-bold text-white text-glow">{session?.user?.name}</h3>
                            <p className="text-sm font-medium text-purple-400">{session?.user?.email}</p>
                            <span className="inline-flex items-center rounded-full bg-green-500/10 px-3 py-1 text-xs font-bold text-green-400 ring-1 ring-inset ring-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                                Verified Account
                            </span>
                        </div>
                    </div>
                </div>
            </TiltCard>

            {/* Account Details */}
            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm">
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                        <User className="h-5 w-5 text-purple-400" />
                        Personal Information
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-zinc-400">Display Name</label>
                            <input
                                type="text"
                                value={session?.user?.name || ''}
                                disabled
                                className="w-full rounded-md border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-white placeholder-zinc-500 focus:border-purple-500 focus:bg-zinc-900 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-zinc-400">Email Address</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={session?.user?.email || ''}
                                    disabled
                                    className="w-full rounded-md border border-zinc-700 bg-zinc-800/50 pl-10 pr-3 py-2 text-white placeholder-zinc-500 focus:border-purple-500 focus:bg-zinc-900 focus:outline-none"
                                />
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm">
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                        <Shield className="h-5 w-5 text-blue-400" />
                        Preferences
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border border-zinc-800 p-3">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-zinc-800 p-2">
                                    <Bell className="h-4 w-4 text-zinc-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">Notifications</p>
                                    <p className="text-xs text-zinc-500">Receive email updates</p>
                                </div>
                            </div>
                            <div className="h-5 w-9 rounded-full bg-purple-600">
                                <div className="h-5 w-5 translate-x-4 rounded-full bg-white shadow-sm" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border border-zinc-800 p-3">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-zinc-800 p-2">
                                    <Moon className="h-4 w-4 text-zinc-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">Dark Mode</p>
                                    <p className="text-xs text-zinc-500">Always enabled</p>
                                </div>
                            </div>
                            <div className="h-5 w-9 rounded-full bg-purple-600">
                                <div className="h-5 w-5 translate-x-4 rounded-full bg-white shadow-sm" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="rounded-xl border border-red-900/20 bg-red-900/5 p-6 backdrop-blur-sm">
                <h2 className="mb-4 text-lg font-semibold text-red-500">Danger Zone</h2>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-white">Sign Out</p>
                        <p className="text-xs text-zinc-500">Sign out of your account on this device</p>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: '/auth/login' })}
                        className="flex items-center gap-2 rounded-md bg-red-500/10 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/20 transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    )
}
