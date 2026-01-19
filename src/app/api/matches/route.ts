import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // 1. Get current user's skills
        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                learnSkills: true,
                teachSkills: true
            }
        })

        if (!currentUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const matches = {
            teachers: [] as any[],
            students: [] as any[]
        }

        // 2. Find Teachers (People teaching what I want to learn)
        if (currentUser.learnSkills.length > 0) {
            for (const learnSkill of currentUser.learnSkills) {
                const potentialTeachers = await prisma.teachSkill.findMany({
                    where: {
                        skill_name: { contains: learnSkill.skill_name },
                        user_id: { not: currentUser.id }
                    },
                    include: {
                        user: {
                            select: { id: true, name: true, image: true, rating_avg: true, location: true }
                        }
                    }
                })

                if (potentialTeachers.length > 0) {
                    matches.teachers.push({
                        learning_goal: learnSkill,
                        offered_by: potentialTeachers
                    })
                }
            }
        }

        // 3. Find Students (People wanting to learn what I teach)
        if (currentUser.teachSkills.length > 0) {
            for (const teachSkill of currentUser.teachSkills) {
                const potentialStudents = await prisma.learnSkill.findMany({
                    where: {
                        skill_name: { contains: teachSkill.skill_name },
                        user_id: { not: currentUser.id }
                    },
                    include: {
                        user: {
                            select: { id: true, name: true, image: true, rating_avg: true, location: true }
                        }
                    }
                })

                if (potentialStudents.length > 0) {
                    matches.students.push({
                        teaching_skill: teachSkill,
                        requested_by: potentialStudents
                    })
                }
            }
        }

        return NextResponse.json({ matches })

    } catch (error) {
        console.error("Error finding matches:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
