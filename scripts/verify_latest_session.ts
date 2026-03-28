
import { PrismaClient } from '@prisma/client'
import fs from 'fs'

const prisma = new PrismaClient()
const logFile = 'verification_result.txt'

const log = (msg: string) => {
    console.log(msg);
    fs.appendFileSync(logFile, msg + '\n');
}

async function main() {
    fs.writeFileSync(logFile, "🔍 Verifying Latest Session & Transactions...\n\n")

    // 1. Get the most recently updated session
    const lastSession = await prisma.sessionModel.findFirst({
        orderBy: { created_at: 'desc' },
        include: {
            teacher: { select: { name: true, email: true } },
            learner: { select: { name: true, email: true } }
        }
    })

    if (!lastSession) {
        log("❌ No sessions found in database.")
        return
    }

    log(`📋 Latest Session ID: ${lastSession.id}`)
    log(`   Status: ${lastSession.status.toUpperCase()}`)
    log(`   Teacher: ${lastSession.teacher.name} (${lastSession.teacher.email})`)
    log(`   Learner: ${lastSession.learner.name} (${lastSession.learner.email})`)
    log(`   Tokens Used: ${lastSession.tokens_used}`)

    // 2. Get Transactions for this session
    const transactions = await prisma.tokenTransaction.findMany({
        where: { session_id: lastSession.id }
    })

    log("\n💰 Transactions Linked to this Session:")
    if (transactions.length === 0) {
        log("   ❌ No transactions recorded for this session.")
    } else {
        transactions.forEach(tx => {
            log(`   - ${tx.type.toUpperCase()}: ${tx.amount} tokens (User ID: ${tx.user_id})`)
        })
    }

    // 3. User Balances
    const teacherBalance = await prisma.tokenBalance.findUnique({ where: { user_id: lastSession.teacher_id } })
    const learnerBalance = await prisma.tokenBalance.findUnique({ where: { user_id: lastSession.learner_id } })

    log("\n💳 Current Wallet Balances:")
    log(`   Teacher Balance: ${teacherBalance?.balance ?? 0} tokens`)
    log(`   Learner Balance: ${learnerBalance?.balance ?? 0} tokens`)

    log("\n✅ Verification Complete.")
}

main()
    .catch(e => {
        console.error(e)
        fs.appendFileSync(logFile, "ERROR: " + e.message)
    })
    .finally(async () => await prisma.$disconnect())
