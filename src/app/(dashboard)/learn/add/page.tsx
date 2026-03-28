'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Loader2, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { TiltCard } from '@/components/ui/TiltCard'

const CATEGORIES = ['Coding', 'Music', 'Design', 'Fitness', 'Language', 'Academics', 'Cooking', 'Other']
const LEVELS = ['Beginner', 'Intermediate', 'Expert']
const MODES = ['Online', 'Offline', 'Hybrid']

export default function AddLearnSkillPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError('')

        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData)

        try {
            const res = await fetch('/api/skills/learn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (!res.ok) {
                const json = await res.json()
                throw new Error(json.error || 'Failed to add learning goal')
            }

            router.push('/skills')
            router.refresh()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-2xl space-y-6"
        >
            <div className="flex items-center gap-4">
                <Link
                    href="/skills"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.04] text-zinc-400 transition-all hover:bg-white/[0.08] hover:text-white border border-white/[0.06]"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold gradient-text-blue">Add Learning Goal</h1>
                    <p className="text-sm text-zinc-500">Tell us what you want to master next</p>
                </div>
            </div>

            <TiltCard className="rounded-2xl p-px glass-card">
                <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl p-8">

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="rounded-xl bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20"
                        >
                            {error}
                        </motion.div>
                    )}

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Skill Name</label>
                            <input
                                name="skill_name"
                                required
                                placeholder="e.g. Python, Yoga, Guitar"
                                className="input-premium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Category</label>
                            <select name="category" className="input-premium">
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Desired Level</label>
                            <select name="desired_level" className="input-premium">
                                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Preferred Mode</label>
                            <select name="mode_preference" className="input-premium">
                                {MODES.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Preferred Language</label>
                            <input
                                name="language_preference"
                                defaultValue="English"
                                className="input-premium"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-bold text-white shadow-lg transition-all hover:from-blue-500 hover:to-indigo-500 hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.98]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Adding Goal...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-5 w-5" />
                                    Add Learning Goal
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </TiltCard>
        </motion.div>
    )
}
