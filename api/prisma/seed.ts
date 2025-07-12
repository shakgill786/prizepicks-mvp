// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const db = new PrismaClient()

async function main() {
  // 1. Create an admin user
  const passwordHash = await bcrypt.hash('adminpassword', 10)
  await db.user.upsert({
    where: { email: 'admin@prizepicks.local' },
    update: {},
    create: {
      email: 'admin@prizepicks.local',
      password: passwordHash,
      displayName: 'Admin',
      isAdmin: true,
      avatarUrl: null,
    },
  })

  // 2. Create some Sports
  const nba = await db.sport.upsert({
    where: { slug: 'nba' },
    update: {},
    create: { slug: 'nba', name: 'NBA' },
  })
  const nfl = await db.sport.upsert({
    where: { slug: 'nfl' },
    update: {},
    create: { slug: 'nfl', name: 'NFL' },
  })

  // 3. Create some PropTemplates
  const pt1 = await db.propTemplate.upsert({
    where: { id: 1 },
    update: {},
    create: {
      sportId: nba.id,
      description: 'LeBron James Over 25.5 Points',
      statKey: 'points',
      threshold: 25.5,
      direction: 'over',
    },
  })
  const pt2 = await db.propTemplate.upsert({
    where: { id: 2 },
    update: {},
    create: {
      sportId: nfl.id,
      description: 'Derrick Henry Over 75.5 Rushing Yards',
      statKey: 'rushingYards',
      threshold: 75.5,
      direction: 'over',
    },
  })

  // 4. Create a couple of Contests
  const now = new Date()
  // daily NBA contest
  await db.contest.create({
    data: {
      sportId: nba.id,
      templateId: pt1.id,
      contestType: 'daily',
      startAt: now,
      endAt: new Date(now.getTime() + 1000 * 60 * 60 * 24),
    },
  })
  // weekly NFL contest
  await db.contest.create({
    data: {
      sportId: nfl.id,
      templateId: pt2.id,
      contestType: 'weekly',
      startAt: now,
      endAt: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7),
    },
  })

  console.log('✅ Seed data created!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
