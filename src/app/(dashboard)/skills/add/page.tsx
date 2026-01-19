'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Loader2, BookOpen, Check } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { TiltCard } from '@/components/ui/TiltCard'

export default function AddSkillPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        category: 'Academics',
        skill_name: '',
        level: 'Beginner',
        experience: 0,
        mode: 'Online',
        language: 'English',
        availability: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            // Convert availability text to simple JSON structure for now
            const availabilityData = {
                notes: formData.availability,
                slots: []
            }

            const res = await fetch('/api/skills/teach', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    availability: availabilityData
                })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Failed to add skill')
            }

            // Success redirect
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
            [name]: name === 'experience' ? parseInt(value) || 0 : value
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
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">Add New Skill</h1>
                    <p className="text-sm text-zinc-400">Share your expertise with the world</p>
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
                                className="w-full rounded-lg border border-zinc-700 bg-black/20 px-3 py-2.5 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
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
                            <input
                                type="text"
                                name="skill_name"
                                required
                                placeholder="e.g. Guitar, Python, Calculus"
                                value={formData.skill_name}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-zinc-700 bg-black/20 px-3 py-2.5 text-white placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Proficiency Level</label>
                            <select
                                name="level"
                                value={formData.level}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-zinc-700 bg-black/20 px-3 py-2.5 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Expert">Expert</option>
                                <option value="Master">Master</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Experience (Years)</label>
                            <input
                                type="number"
                                name="experience"
                                min="0"
                                value={formData.experience}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-zinc-700 bg-black/20 px-3 py-2.5 text-white placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Teaching Mode</label>
                            <select
                                name="mode"
                                value={formData.mode}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-zinc-700 bg-black/20 px-3 py-2.5 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            >
                                <option value="Online">Online via Video Call</option>
                                <option value="Offline">In-Person (Offline)</option>
                                <option value="Hybrid">Hybrid (Both)</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Language</label>
                            <input
                                type="text"
                                name="language"
                                placeholder="e.g. English, Hindi, Spanish"
                                value={formData.language}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-zinc-700 bg-black/20 px-3 py-2.5 text-white placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Availability Info</label>
                        <textarea
                            name="availability"
                            rows={3}
                            placeholder="Weekends, 6PM-9PM"
                            value={formData.availability}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-zinc-700 bg-black/20 px-3 py-2.5 text-white placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 font-semibold text-white shadow-lg transition-all hover:from-purple-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Adding Skill...
                                </>
                            ) : (
                                <>
                                    <BookOpen className="h-5 w-5" />
                                    Create Teaching Skill
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </TiltCard>
        </motion.div>
    )
}
