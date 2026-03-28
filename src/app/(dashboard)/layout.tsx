"use client"

import { useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import { Menu, X } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import Link from 'next/link'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <div className="flex min-h-screen bg-[#030303] text-white">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex fixed inset-y-0 left-0 z-40 w-64 flex-col border-r border-white/[0.04] bg-[#060606]/80 backdrop-blur-xl">
                <Sidebar />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
                    <aside className="absolute inset-y-0 left-0 w-64 border-r border-white/[0.04] bg-[#060606] shadow-2xl animate-slide-in-right">
                        <Sidebar />
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <div className="flex flex-1 flex-col md:pl-64">
                {/* Mobile Header */}
                <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/[0.04] bg-[#030303]/80 backdrop-blur-xl px-4 py-3 md:hidden">
                    <Link href="/">
                        <Logo />
                    </Link>
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="rounded-lg p-2 text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-all"
                    >
                        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </header>

                {/* Page Content */}
                <main className="flex-1 px-4 md:px-8 py-6 md:py-8 max-w-7xl mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    )
}
