// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data (optional - remove in production!)
  await prisma.vote.deleteMany({});
  await prisma.danceCrew.deleteMany({});

  // Seed dance crews
  const crews = [
    {
      id: 1,
      name: "Urban Pulse",
      image: "/DanceCrew/DanceCrew.JPG",
      color: "#50C878",
      description: "High-energy hip hop crew bringing street culture to the stage",
    },
    {
      id: 2,
      name: "Groove Dynasty",
      image: "/DanceCrew/DanceCrew2.JPG",
      color: "#F59E0B",
      description: "Contemporary fusion dancers blending traditional and modern styles",
    },
    {
      id: 3,
      name: "BreakWave",
      image: "/DanceCrew/DanceCrew3.JPG",
      color: "#40E0D0",
      description: "Award-winning B-boys pushing the limits of breaking",
    },
    {
      id: 4,
      name: "Neon Steps",
      image: "/DanceCrew/DanceCrew4.JPG",
      color: "#06B6D4",
      description: "Energetic K-pop cover crew with synchronized perfection",
    },
    {
      id: 5,
      name: "Rhythm Nation",
      image: "/DanceCrew/DanceCrew5.JPG",
      color: "#C8102E",
      description: "Afro-fusion collective celebrating cultural dance heritage",
    },
    {
      id: 6,
      name: "Flow State",
      image: "/DanceCrew/DanceCrew6.JPG",
      color: "#D58512",
      description: "Contemporary jazz ensemble with fluid choreography",
    },
    {
      id: 7,
      name: "Street Kings",
      image: "/DanceCrew/DanceCrew7.JPG",
      color: "#EC4899",
      description: "Urban dance pioneers defining the next generation",
    },
    {
      id: 8,
      name: "Vibe Tribe",
      image: "/DanceCrew/DanceCrew8.JPG",
      color: "#00FFFF",
      description: "Experimental choreography pushing creative boundaries",
    },
    {
      id: 9,
      name: "Motion Crew",
      image: "/DanceCrew/DanceCrew9.JPG",
      color: "#14B8A6",
      description: "Contemporary breakdance fusion collective",
    },
    {
      id: 10,
      name: "Beat Breakers",
      image: "/DanceCrew/DanceCrew10.JPG",
      color: "#D58512",
      description: "Old-school breaking revival bringing back the classics",
    },
    {
      id: 11,
      name: "Pulse Collective",
      image: "/DanceCrew/DanceCrew11.JPG",
      color: "#E31E24",
      description: "Multi-genre innovators redefining dance culture",
    },
  ];

  for (const crew of crews) {
    await prisma.danceCrew.upsert({
      where: { id: crew.id },
      update: crew,
      create: crew,
    });
  }

  console.log("✅ Seeded", crews.length, "dance crews");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });