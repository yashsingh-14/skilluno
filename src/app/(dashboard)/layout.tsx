'use client'

import Sidebar from '@/components/dashboard/Sidebar'
import { Menu } from 'lucide-react'
import { useState } from 'react'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="flex h-screen bg-black text-white overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-4 left-4 z-50 w-64 transform rounded-2xl border border-white/5 bg-black/20 backdrop-blur-xl transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } glass shadow-2xl`}
            >
                <div className="h-full overflow-hidden rounded-2xl">
                    <Sidebar />
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Mobile Header */}
                <header className="flex h-16 items-center justify-between border-b border-white/5 bg-black/20 backdrop-blur-md px-4 lg:hidden">
                    <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">SkillUNO</div>
                    <button onClick={() => setSidebarOpen(true)} className="p-2 text-zinc-400 hover:text-white">
                        <Menu className="h-6 w-6" />
                    </button>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-4 md:p-8">
                    <div className="mx-auto max-w-7xl animate-in fade-in zoom-in duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
