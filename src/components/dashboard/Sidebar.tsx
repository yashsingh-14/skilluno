'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, GraduationCap, Users, Calendar, Wallet, Settings, Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Teach Skills', href: '/skills', icon: GraduationCap },
    { name: 'Learn Skills', href: '/learn', icon: BookOpen },
    { name: 'Matches', href: '/matches', icon: Users },
    { name: 'Inbox', href: '/requests', icon: Inbox },
    { name: 'Sessions', href: '/sessions', icon: Calendar },
    { name: 'Wallet', href: '/wallet', icon: Wallet },
    { name: 'Settings', href: '/settings', icon: Settings },
]

import { Logo } from '@/components/ui/Logo'

// ... (other imports)

export default function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname()

    return (
        <div className={cn("flex h-full w-64 flex-col bg-zinc-900 text-white", className)}>
            <div className="flex h-16 items-center px-6">
                <Link href="/" className="hover:opacity-80 transition-opacity">
                    <Logo />
                </Link>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-purple-600 text-white"
                                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
