'use client'

const SKILLS = [
    "Guitar", "Python", "Yoga", "Spanish", "Cooking", "Calculus", "Piano", "React",
    "Fitness", "Photography", "Marketing", "Writing", "Design", "Singing", "Chess",
    "Guitar", "Python", "Yoga", "Spanish", "Cooking", "Calculus", "Piano", "React",
    "Fitness", "Photography", "Marketing", "Writing", "Design", "Singing", "Chess",
]

export default function SkillsMarquee() {
    return (
        <div className="w-full overflow-hidden py-10 opacity-60 pointer-events-none">
            <div className="flex animate-marquee whitespace-nowrap">
                {SKILLS.map((skill, index) => (
                    <span
                        key={index}
                        className="mx-8 text-4xl font-bold uppercase text-transparent bg-clip-text bg-gradient-to-b from-zinc-700 to-zinc-900/0 stroke-text"
                        style={{ WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}
                    >
                        {skill}
                    </span>
                ))}
            </div>

            <style jsx>{`
                .stroke-text {
                    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.1);
                }
            `}</style>
        </div>
    )
}
