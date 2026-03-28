'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
    id: string
    message: string
    type: ToastType
}

interface ToastContext {
    toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContext>({ toast: () => { } })

export function useToast() {
    return useContext(ToastContext)
}

const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
}

const colors = {
    success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
    error: 'border-red-500/30 bg-red-500/10 text-red-400',
    info: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
    warning: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const toast = useCallback((message: string, type: ToastType = 'success') => {
        const id = Math.random().toString(36).substring(7)
        setToasts(prev => [...prev, { id, message, type }])

        // Auto-remove after 4 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
        }, 4000)
    }, [])

    const remove = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 max-w-sm">
                {toasts.map((t) => {
                    const Icon = icons[t.type]
                    return (
                        <div
                            key={t.id}
                            className={`flex items-center gap-3 rounded-xl border px-4 py-3 backdrop-blur-xl shadow-2xl animate-slide-in-right ${colors[t.type]}`}
                        >
                            <Icon className="h-5 w-5 shrink-0" />
                            <p className="text-sm font-medium flex-1">{t.message}</p>
                            <button
                                onClick={() => remove(t.id)}
                                className="shrink-0 rounded-lg p-1 hover:bg-white/10 transition-colors"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    )
                })}
            </div>
        </ToastContext.Provider>
    )
}
