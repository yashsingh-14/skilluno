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

export default function Stats() {
    return (
        <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto mb-8 px-4">
            {STATS.map((stat, idx) => (
                <div key={idx} className="group text-center relative">
                    <div className="p-4 md:p-6 rounded-2xl border border-white/[0.04] bg-white/[0.02] backdrop-blur-sm transition-all group-hover:bg-white/[0.04] group-hover:border-white/[0.08]">
                        <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                        <div className="text-[10px] md:text-xs font-medium text-zinc-500 uppercase tracking-[0.2em] mt-1">
                            {stat.label}
                        </div>
                    </div>
                    {/* Gradient divider */}
                    {idx < STATS.length - 1 && (
                        <div className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 w-px h-8 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                    )}
                </div>
            ))}
        </div>
    )
}
