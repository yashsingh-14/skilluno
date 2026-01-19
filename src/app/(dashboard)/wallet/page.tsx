'use client'

import { useEffect, useState } from 'react'
import { Wallet, ArrowUpRight, ArrowDownLeft, History, Loader2, CreditCard } from 'lucide-react'

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

    if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-purple-500" /></div>

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Token Wallet</h1>

            {/* Balance Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 p-8 shadow-2xl">
                <div className="relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-white/20 p-2">
                            <Wallet className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-sm font-medium text-purple-100">Total Balance</span>
                    </div>
                    <div className="mt-4 text-5xl font-bold text-white">
                        {balance.toLocaleString()} <span className="text-2xl text-purple-200">UNO</span>
                    </div>
                    <div className="mt-8 flex gap-4">
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
                                        alert('Success! Order ID: ' + data.orderId)
                                        window.location.reload()
                                    }
                                } catch (e) {
                                    alert('Payment failed')
                                } finally {
                                    setLoading(false)
                                }
                            }}
                            className="flex items-center gap-2 rounded-full bg-white px-6 py-2.5 font-bold text-purple-700 transition-transform hover:scale-105"
                        >
                            <CreditCard className="h-4 w-4" /> Buy 100 Tokens (₹10)
                        </button>
                    </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-purple-900/40 blur-2xl" />
            </div>

            {/* Transaction History */}
            <div>
                <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
                    <History className="h-5 w-5 text-zinc-400" />
                    Recent Transactions
                </h2>

                <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50">
                    {transactions.length === 0 ? (
                        <div className="p-8 text-center text-zinc-500">No transactions found.</div>
                    ) : (
                        <div className="divide-y divide-zinc-800">
                            {transactions.map((tx) => (
                                <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-zinc-800/50">
                                    <div className="flex items-center gap-4">
                                        <div className={`rounded-full p-2 ${tx.type === 'earned' || tx.type === 'purchased'
                                            ? 'bg-green-500/10 text-green-500'
                                            : 'bg-red-500/10 text-red-500'
                                            }`}>
                                            {tx.type === 'earned' || tx.type === 'purchased' ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                                        </div>
                                        <div>
                                            <div className="font-medium capitalize text-white">{tx.type}</div>
                                            <div className="text-xs text-zinc-500">{new Date(tx.created_at).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div className={`font-mono font-bold ${tx.type === 'earned' || tx.type === 'purchased'
                                        ? 'text-green-500'
                                        : 'text-white'
                                        }`}>
                                        {tx.type === 'earned' || tx.type === 'purchased' ? '+' : '-'}{tx.amount}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
