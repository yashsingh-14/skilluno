'use client'

import { TiltCard } from "@/components/ui/TiltCard"

const STATS = [
    { label: "Active Users", value: "2K+" },
    { label: "Skills Exchanged", value: "15K+" },
    { label: "Tokens Traded", value: "50K+" },
]

export default function Stats() {
    return (
        <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto mb-20">
            {STATS.map((stat, idx) => (
                <TiltCard key={idx} className="bg-transparent group">
                    <div className="text-center p-6 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm transition-all group-hover:bg-white/10">
                        <div className="text-3xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">{stat.value}</div>
                        <div className="text-sm font-medium text-zinc-500 uppercase tracking-widest">{stat.label}</div>
                    </div>
                </TiltCard>
            ))}
        </div>
    )
}
