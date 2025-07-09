// api/prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  // Upsert a “test” user with ID = 1.
  await db.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      // include all non-nullable fields your schema requires:
      // id is optional here (auto–increment), but you can override if you like.
      id: 1,
      email: 'test@example.com',
      password: 'secretpassword'
    },
  });

  console.log('✅ Seeded user #1');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
  })
  .finally(async () => {
    await db.$disconnect();
  });
