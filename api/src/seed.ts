// api/src/seed.ts
import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function main() {
  const nba = await db.sport.upsert({
    where: { slug: 'nba' },
    update: {},
    create: { slug: 'nba', name: 'NBA' },
  });

  const tpl = await db.propTemplate.upsert({
    where: { id: 1 },
    update: {},
    create: {
      sportId: nba.id,
      description: 'Over 25.5 points – LeBron James',
      statKey: 'points',
      threshold: 25.5,
      direction: 'over',
    },
  });

  await db.contest.upsert({
    where: { id: 1 },
    update: {},
    create: {
      sportId: nba.id,
      templateId: tpl.id,
      contestType: 'daily',
      startAt: new Date(),
      endAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
