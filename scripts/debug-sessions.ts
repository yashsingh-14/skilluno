import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('--- DEBUGGING SESSIONS ---')

    const users = await prisma.user.findMany({
        select: { id: true, email: true, name: true }
    })
    console.log('Users:', users)

    const sessions = await prisma.sessionModel.findMany({
        include: {
            teacher: { select: { email: true } },
            learner: { select: { email: true } }
        }
    })

    console.log(`Found ${sessions.length} sessions in DB:`)
    sessions.forEach(s => {
        console.log({
            id: s.id,
            status: s.status,
            initiated_by: s.initiated_by,
            teacher: s.teacher.email,
            learner: s.learner.email,
            scheduled_at: s.scheduled_at
        })
    })
    console.log('--------------------------')
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
