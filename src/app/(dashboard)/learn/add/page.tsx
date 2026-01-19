'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Loader2 } from 'lucide-react'

const CATEGORIES = ['Coding', 'Music', 'Design', 'Fitness', 'Language', 'Academics', 'Other']
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

            router.push('/learn')
            router.refresh()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Add a Learning Goal</h1>
                <p className="text-zinc-400">What do you want to master next?</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                {error && (
                    <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
                        {error}
                    </div>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Skill Name</label>
                        <input name="skill_name" required className="w-full rounded-md border border-zinc-700 bg-zinc-800 p-2" placeholder="e.g. Python, Yoga" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <select name="category" className="w-full rounded-md border border-zinc-700 bg-zinc-800 p-2">
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Desired Level</label>
                        <select name="desired_level" className="w-full rounded-md border border-zinc-700 bg-zinc-800 p-2">
                            {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Preferred Mode</label>
                        <select name="mode_preference" className="w-full rounded-md border border-zinc-700 bg-zinc-800 p-2">
                            {MODES.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Preferred Language</label>
                        <input name="language_preference" defaultValue="English" className="w-full rounded-md border border-zinc-700 bg-zinc-800 p-2" />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-pink-600 px-4 py-3 font-semibold text-white hover:bg-pink-500 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Plus className="h-5 w-5" /> Add to Wishlist</>}
                </button>
            </form>
        </div>
    )
}
