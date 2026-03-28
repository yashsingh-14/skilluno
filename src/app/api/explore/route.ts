import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
    try {
        const url = new URL(request.url)
        const category = url.searchParams.get('category')
        const search = url.searchParams.get('q')

        const where: any = {}
        if (category && category !== 'All') {
            where.category = category
        }
        if (search) {
            where.skill_name = { contains: search }
        }

        const skills = await prisma.teachSkill.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        rating_avg: true,
                        location: true,
                    }
                }
            },
            orderBy: { created_at: 'desc' },
            take: 50,
        })

        // Get categories for filter
        const categories = await prisma.teachSkill.findMany({
            select: { category: true },
            distinct: ['category'],
        })

        return NextResponse.json({
            skills,
            categories: ['All', ...categories.map(c => c.category)],
        })

    } catch (error) {
        console.error('Explore error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
