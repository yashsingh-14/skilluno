'use client'

export const Logo = ({ className = "", size = "default" }: { className?: string, size?: "default" | "large" }) => {
    const isLarge = size === "large"

    // Adjust SVG dimensions based on size
    const iWidth = isLarge ? 6 : 5
    const iHeight = isLarge ? 24 : 19

    return (
        <div className={`flex items-center gap-2.5 font-sans select-none group ${className}`}>
            {/* Minimalist Symbol: Two interlocking shapes symbolizing exchange */}
            {/* Minimalist Symbol: Two interlocking shapes symbolizing exchange */}
            <div className={`relative flex flex-col items-center justify-center ${isLarge ? 'h-8 w-8' : 'h-7 w-7'}`}>
                <div className="absolute top-0 right-0 h-4/6 w-4/6 rounded-full bg-purple-500/90 mix-blend-screen shadow-[0_0_15px_rgba(168,85,247,0.6)] animate-orbit-1" />
                <div className="absolute bottom-0 left-0 h-4/6 w-4/6 rounded-full bg-indigo-500/90 mix-blend-screen shadow-[0_0_15px_rgba(99,102,241,0.6)] animate-orbit-2" />
            </div>

            {/* Typography with Custom 'i' */}
            <div className="flex flex-col justify-center">
                <span className={`${isLarge ? 'text-2xl' : 'text-xl'} font-bold tracking-tight text-white leading-none flex items-baseline`}>
                    Sk
                    {/* Custom SVG 'i' to color the dot */}
                    <svg
                        width={iWidth}
                        height={iHeight}
                        viewBox="0 0 100 400"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mx-[1px] self-end mb-[1px]"
                        style={{ height: isLarge ? '0.8em' : '0.8em' }}
                    >
                        {/* Stem */}
                        <rect x="10" y="140" width="80" height="260" rx="10" fill="white" />
                        {/* Dot */}
                        <circle cx="50" cy="50" r="50" className="fill-purple-500" />
                    </svg>
                    ll<span className="font-light text-zinc-300">UNO</span>
                </span>
            </div>
        </div>
    )
}
