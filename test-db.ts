import { prisma } from "./src/lib/prisma";

async function test() {
  console.log("🚀 Testing database connection...");

  const crews = await prisma.danceCrew.findMany({
    take: 1,
  });

  console.log("✅ DB OK. Sample crew:", crews);
}

test()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
