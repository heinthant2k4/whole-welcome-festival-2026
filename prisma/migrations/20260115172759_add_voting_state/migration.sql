-- CreateTable
CREATE TABLE "voting_state" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "paused" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "voting_state_pkey" PRIMARY KEY ("id")
);
