'use client'

import { useEffect, useState } from 'react'
import { Wallet, ArrowUpRight, ArrowDownLeft, History, Loader2, CreditCard, Coins, ShoppingCart } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

interface Transaction {
    id: string
    type: string
    amount: number
    created_at: string
}

export default function WalletPage() {
    const [balance, setBalance] = useState(0)
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)
    const { toast } = useToast()

    useEffect(() => {
        fetch('/api/wallet')
            .then(res => res.json())
            .then(data => {
                if (data.balance !== undefined) setBalance(data.balance)
                if (data.transactions) setTransactions(data.transactions)
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const txIcon = (type: string) => {
        if (type === 'earned') return ArrowDownLeft
        if (type === 'purchased') return ShoppingCart
        return ArrowUpRight
    }

    if (loading) return (
        <div className="flex h-96 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                <span className="text-xs text-zinc-600">Loading wallet...</span>
            </div>
        </div>
    )

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    <span className="gradient-text-purple">Token Wallet</span>
                </h1>
                <p className="mt-1 text-sm text-zinc-500">Manage your UNO tokens and transaction history.</p>
            </div>

            {/* Balance Card */}
            <div className="relative overflow-hidden rounded-2xl p-px">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/40 via-indigo-600/40 to-purple-600/40 animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                <div className="relative rounded-2xl bg-zinc-950 p-8 overflow-hidden">
                    {/* Inner glow effects */}
                    <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-purple-600/10 blur-[80px] pointer-events-none" />
                    <div className="absolute -left-10 -bottom-10 h-56 w-56 rounded-full bg-indigo-600/10 blur-[60px] pointer-events-none" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-white/[0.08] p-2.5 backdrop-blur-sm">
                                <Wallet className="h-5 w-5 text-purple-300" />
                            </div>
                            <span className="text-sm font-medium text-zinc-400">Total Balance</span>
                        </div>
                        <div className="mt-6 flex items-baseline gap-3">
                            <span className="text-6xl font-bold text-white tracking-tight tabular-nums">{balance.toLocaleString()}</span>
                            <span className="text-xl font-medium text-purple-300/80">UNO</span>
                        </div>
                        <div className="mt-8 flex gap-3">
                            <button
                                onClick={async () => {
                                    setLoading(true)
                                    try {
                                        const res = await fetch('/api/tokens/buy', {
                                            method: 'POST',
                                            body: JSON.stringify({ amount: 10, tokens: 100 })
                                        })
                                        const data = await res.json()
                                        if (data.success) {
                                            toast('100 tokens purchased successfully! 🎉', 'success')
                                            window.location.reload()
                                        }
                                    } catch (e) {
                                        toast('Payment failed. Try again.', 'error')
                                    } finally {
                                        setLoading(false)
                                    }
                                }}
                                className="group flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-zinc-900 transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] active:scale-[0.98]"
                            >
                                <CreditCard className="h-4 w-4" />
                                Buy 100 Tokens
                                <span className="text-zinc-500 text-sm font-normal">₹10</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transaction History */}
            <div>
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                    <History className="h-5 w-5 text-zinc-400" />
                    Recent Transactions
                </h2>

                <div className="overflow-hidden rounded-2xl border border-white/[0.04] bg-white/[0.01]">
                    {transactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                            <div className="mb-3 rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/[0.04]">
                                <Coins className="h-8 w-8 text-zinc-700" />
                            </div>
                            <p className="text-sm text-zinc-400">No transactions yet</p>
                            <p className="text-xs text-zinc-600 mt-1">Purchase tokens or complete sessions to see activity here.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/[0.04]">
                            {transactions.map((tx) => {
                                const Icon = txIcon(tx.type)
                                const isIncome = tx.type === 'earned' || tx.type === 'purchased'
                                return (
                                    <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`rounded-xl p-2.5 ${isIncome
                                                ? 'bg-emerald-500/10 text-emerald-400'
                                                : 'bg-red-500/10 text-red-400'
                                                }`}>
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium capitalize text-white">{tx.type}</div>
                                                <div className="text-xs text-zinc-600">{new Date(tx.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                            </div>
                                        </div>
                                        <div className={`font-mono text-sm font-bold ${isIncome ? 'text-emerald-400' : 'text-white'}`}>
                                            {isIncome ? '+' : '-'}{tx.amount} <span className="text-zinc-600">UNO</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
