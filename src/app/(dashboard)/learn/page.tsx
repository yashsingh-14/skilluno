import Link from 'next/link'
import { Plus } from 'lucide-react'

export default function LearnPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">My Learning Wishlist</h1>
                <Link
                    href="/learn/add"
                    className="flex items-center gap-2 rounded-full bg-pink-600 px-4 py-2 font-medium text-white hover:bg-pink-700"
                >
                    <Plus className="h-5 w-5" />
                    Add Goal
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Placeholder for Learn Cards */}
                <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 text-zinc-500">
                    <p>No learning goals yet.</p>
                </div>
            </div>
        </div>
    )
}
