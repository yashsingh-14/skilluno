'use client'

import { useEffect, useRef, useState } from 'react'

const STATS = [
    { label: "Active Learners", value: 2000, suffix: "+" },
    { label: "Skills Exchanged", value: 15000, suffix: "+" },
    { label: "Tokens Traded", value: 50000, suffix: "+" },
]

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
    const [count, setCount] = useState(0)
    const ref = useRef<HTMLDivElement>(null)
    const [started, setStarted] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started) {
                    setStarted(true)
                }
            },
            { threshold: 0.5 }
        )

        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [started])

    useEffect(() => {
        if (!started) return

        const duration = 2000
        const steps = 60
        const increment = target / steps
        let current = 0

        const timer = setInterval(() => {
            current += increment
            if (current >= target) {
                setCount(target)
                clearInterval(timer)
            } else {
                setCount(Math.floor(current))
            }
        }, duration / steps)

        return () => clearInterval(timer)
    }, [started, target])

    const formatNumber = (n: number) => {
        if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'K'
        return n.toString()
    }

    return (
        <div ref={ref} className="text-3xl md:text-4xl font-bold text-white tabular-nums">
            {formatNumber(count)}{suffix}
        </div>
    )
}

function GlowCard({ children, className }: { children: React.ReactNode; className?: string }) {
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
    const [isHovered, setIsHovered] = useState(false)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setMousePos({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        })
    }

    return (
        <div
            className={`relative rounded-2xl overflow-hidden ${className || ''}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Glow border */}
            <div
                className="absolute inset-0 rounded-2xl transition-opacity duration-500"
                style={{
                    opacity: isHovered ? 1 : 0,
                    background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(147,51,234,0.6) 0%, rgba(99,102,241,0.25) 40%, transparent 70%)`,
                }}
            />
            {/* Inner bg mask */}
            <div
                className="absolute inset-[1px] rounded-2xl transition-all duration-500"
                style={{
                    background: isHovered ? 'rgba(3,3,3,0.95)' : 'rgba(255,255,255,0.02)',
                }}
            />
            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    )
}

export default function Stats() {
    return (
        <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto mb-8 px-4">
            {STATS.map((stat, idx) => (
                <div key={idx} className="group text-center relative">
                    <GlowCard className="border border-white/[0.06]">
                        <div className="p-4 md:p-6">
                            <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                            <div className="text-[10px] md:text-xs font-medium text-zinc-500 uppercase tracking-[0.2em] mt-1">
                                {stat.label}
                            </div>
                        </div>
                    </GlowCard>
                    {/* Gradient divider */}
                    {idx < STATS.length - 1 && (
                        <div className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 w-px h-8 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                    )}
                </div>
            ))}
        </div>
    )
}
