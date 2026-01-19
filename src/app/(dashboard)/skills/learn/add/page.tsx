'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Loader2, Rocket, Search } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { TiltCard } from '@/components/ui/TiltCard'

export default function AddLearnSkillPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        category: 'Academics',
        skill_name: '',
        desired_level: 'Beginner',
        mode_preference: 'Online',
        language_preference: 'English',
        availability: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            // Convert availability text to simple JSON structure
            const availabilityData = {
                notes: formData.availability,
                slots: []
            }

            const res = await fetch('/api/skills/learn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    category: formData.category,
                    skill_name: formData.skill_name,
                    desired_level: formData.desired_level,
                    mode_preference: formData.mode_preference,
                    language_preference: formData.language_preference,
                    availability: JSON.stringify(availabilityData) // Schema expects string
                })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Failed to add learning goal')
            }

            router.push('/skills')
            router.refresh()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
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
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800/50 text-zinc-400 transition-all hover:bg-zinc-700 hover:text-white border border-white/5"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">I Want to Learn</h1>
                    <p className="text-sm text-zinc-400">Set a new learning goal and find a mentor.</p>
                </div>
            </div>

            <TiltCard className="rounded-2xl p-1 bg-zinc-900/40 glass-card">
                <form onSubmit={handleSubmit} className="space-y-6 rounded-xl bg-gradient-to-br from-zinc-800/30 to-zinc-900/30 p-8 backdrop-blur-sm">

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="rounded-md bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20"
                        >
                            {error}
                        </motion.div>
                    )}

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-zinc-700 bg-black/20 px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="Academics">Academics</option>
                                <option value="Music">Music</option>
                                <option value="Programming">Programming</option>
                                <option value="Language">Language</option>
                                <option value="Art">Art</option>
                                <option value="Fitness">Fitness</option>
                                <option value="Cooking">Cooking</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Skill Name</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                                <input
                                    type="text"
                                    name="skill_name"
                                    required
                                    placeholder="e.g. Piano, French, React Native"
                                    value={formData.skill_name}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-zinc-700 bg-black/20 pl-10 pr-3 py-2.5 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Target Proficiency</label>
                            <select
                                name="desired_level"
                                value={formData.desired_level}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-zinc-700 bg-black/20 px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Expert">Expert</option>
                                <option value="Master">Master</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Preferred Mode</label>
                            <select
                                name="mode_preference"
                                value={formData.mode_preference}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-zinc-700 bg-black/20 px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="Online">Online via Video Call</option>
                                <option value="Offline">In-Person (Offline)</option>
                                <option value="Any">Any Mode</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Preferred Language</label>
                            <input
                                type="text"
                                name="language_preference"
                                placeholder="e.g. English, Hindi"
                                value={formData.language_preference}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-zinc-700 bg-black/20 px-3 py-2.5 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Availability / Notes</label>
                        <textarea
                            name="availability"
                            rows={3}
                            placeholder="I am free on weekends. I prefer morning sessions."
                            value={formData.availability}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-zinc-700 bg-black/20 px-3 py-2.5 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-3 font-semibold text-white shadow-lg transition-all hover:from-blue-500 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Saving Goal...
                                </>
                            ) : (
                                <>
                                    <Rocket className="h-5 w-5" />
                                    Start Learning Journey
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </TiltCard>
        </motion.div>
    )
}
