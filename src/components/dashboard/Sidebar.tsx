'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, GraduationCap, Users, Calendar, Wallet, Settings, Inbox, LogOut, Compass, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/ui/Logo'
import { useSession, signOut } from 'next-auth/react'

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Explore', href: '/explore', icon: Compass },
    { name: 'My Skills', href: '/skills', icon: GraduationCap },
    { name: 'Learn', href: '/learn', icon: BookOpen },
    { name: 'Matches', href: '/matches', icon: Users },
    { name: 'Inbox', href: '/requests', icon: Inbox },
    { name: 'Sessions', href: '/sessions', icon: Calendar },
    { name: 'Wallet', href: '/wallet', icon: Wallet },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
]

const bottomNav = [
    { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname()
    const { data: session } = useSession()

    return (
        <div className={cn("flex h-full w-64 flex-col", className)}>
            {/* Logo */}
            <div className="flex h-16 items-center px-5 border-b border-white/[0.04]">
                <Link href="/" className="hover:opacity-80 transition-opacity">
                    <Logo />
                </Link>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 space-y-0.5 px-3 py-4 overflow-y-auto">
                <p className="px-3 mb-2 text-[10px] font-semibold text-zinc-600 uppercase tracking-[0.2em]">
                    Menu
                </p>
                {navigation.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 relative",
                                isActive
                                    ? "text-white"
                                    : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.03]"
                            )}
                        >
                            {/* Active indicator */}
                            {isActive && (
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/20 to-indigo-600/10 border border-purple-500/20" />
                            )}
                            <div className={cn(
                                "relative z-10 flex items-center justify-center h-8 w-8 rounded-lg transition-all",
                                isActive
                                    ? "bg-purple-600/20 text-purple-400"
                                    : "text-zinc-500 group-hover:text-zinc-300"
                            )}>
                                <item.icon className="h-[18px] w-[18px]" />
                            </div>
                            <span className="relative z-10">{item.name}</span>
                            {item.name === 'Inbox' && (
                                <span className="relative z-10 ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-pink-600/20 text-[10px] font-bold text-pink-400">
                                    •
                                </span>
                            )}
                        </Link>
                    )
                })}

                {/* Divider */}
                <div className="my-4 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

                <p className="px-3 mb-2 text-[10px] font-semibold text-zinc-600 uppercase tracking-[0.2em]">
                    Account
                </p>
                {bottomNav.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 relative",
                                isActive
                                    ? "text-white"
                                    : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.03]"
                            )}
                        >
                            {isActive && (
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/20 to-indigo-600/10 border border-purple-500/20" />
                            )}
                            <div className={cn(
                                "relative z-10 flex items-center justify-center h-8 w-8 rounded-lg transition-all",
                                isActive ? "bg-purple-600/20 text-purple-400" : "text-zinc-500 group-hover:text-zinc-300"
                            )}>
                                <item.icon className="h-[18px] w-[18px]" />
                            </div>
                            <span className="relative z-10">{item.name}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* User Profile Section */}
            <div className="p-3 border-t border-white/[0.04]">
                <div className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-white/[0.03] transition-colors group">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-xs font-bold text-white overflow-hidden ring-2 ring-purple-500/20">
                        {session?.user?.image ? (
                            <img src={session.user.image} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                            session?.user?.name?.charAt(0)?.toUpperCase() || '?'
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-200 truncate">
                            {session?.user?.name || 'User'}
                        </p>
                        <p className="text-[11px] text-zinc-600 truncate">
                            {session?.user?.email || ''}
                        </p>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: '/auth/login' })}
                        className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                        title="Sign Out"
                    >
                        <LogOut className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}
