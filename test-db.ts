// test-db.ts
import { connectDB, prisma } from "./src/lib/prisma";

async function test() {
  console.log("🚀 Testing database connection...");
  try {
    await connectDB();
    
    // Attempt a simple query to ensure the table exists
    const count = await prisma.danceCrew.count();
    console.log(`📊 Successfully queried database. Found ${count} dance crews.`);
    
  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await prisma.$disconnect();
    process.exit();
  }
}

test();