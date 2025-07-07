import { PrismaClient } from '@prisma/client';
import { fetchStats } from '../utils/sportsApiClient';

const db = new PrismaClient();

export async function runScoring() {
  // Only score contests that have ended
  const contests = await db.contest.findMany({
    where: { endAt: { lte: new Date() } },
    include: { template: true, sport: true },
  });

  for (const contest of contests) {
    const actual = await fetchStats(
      contest.sport.slug,
      contest.template.statKey
    );

    const picks = await db.pick.findMany({
      where: { contestId: contest.id },
    });

    for (const pick of picks) {
      const { threshold, direction } = contest.template;
      const hit =
        direction === 'over'
          ? actual >= threshold
          : actual <= threshold;
      const score = hit ? 100 : 0;
      await db.pick.update({
        where: { id: pick.id },
        data: { score },
      });
    }
  }
}
