'use client'

const SKILLS_ROW_1 = [
    "Guitar", "Python", "Yoga", "Spanish", "Cooking", "Calculus", "Piano", "React",
    "Fitness", "Photography", "Marketing", "Writing", "Design", "Singing", "Chess",
    "Guitar", "Python", "Yoga", "Spanish", "Cooking", "Calculus", "Piano", "React",
    "Fitness", "Photography", "Marketing", "Writing", "Design", "Singing", "Chess",
]

const SKILLS_ROW_2 = [
    "TypeScript", "Dancing", "Finance", "Meditation", "Drawing", "Guitar", "Machine Learning",
    "Cooking", "Physics", "Animation", "Video Editing", "French", "Boxing", "UI/UX",
    "TypeScript", "Dancing", "Finance", "Meditation", "Drawing", "Guitar", "Machine Learning",
    "Cooking", "Physics", "Animation", "Video Editing", "French", "Boxing", "UI/UX",
]

export default function SkillsMarquee() {
    return (
        <div className="w-full overflow-hidden py-8 opacity-50 pointer-events-none marquee-mask space-y-4">
            {/* Row 1 — Left */}
            <div className="flex animate-marquee whitespace-nowrap">
                {SKILLS_ROW_1.map((skill, index) => (
                    <span
                        key={`r1-${index}`}
                        className="mx-6 text-3xl md:text-4xl font-bold uppercase text-transparent"
                        style={{ WebkitTextStroke: '1px rgba(255,255,255,0.07)' }}
                    >
                        {skill}
                    </span>
                ))}
            </div>

            {/* Row 2 — Right (reversed) */}
            <div className="flex animate-marquee-reverse whitespace-nowrap">
                {SKILLS_ROW_2.map((skill, index) => (
                    <span
                        key={`r2-${index}`}
                        className="mx-6 text-3xl md:text-4xl font-bold uppercase text-transparent"
                        style={{ WebkitTextStroke: '1px rgba(255,255,255,0.05)' }}
                    >
                        {skill}
                    </span>
                ))}
            </div>
        </div>
    )
}
