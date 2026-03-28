
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log("🔍 Checking User Image Data...\n")

    const users = await prisma.user.findMany({
        select: { id: true, name: true, image: true, email: true },
        orderBy: { created_at: 'desc' },
        take: 5
    })

    users.forEach(u => {
        console.log(`User: ${u.name} (${u.email})`)
        console.log(`Image: ${u.image ? u.image : 'NULL'}`)
        console.log('---')
    })
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
