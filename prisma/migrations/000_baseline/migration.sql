-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "dance_crews" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dance_crews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "votes" (
    "id" TEXT NOT NULL,
    "crewId" INTEGER NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "votes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dance_crews_name_key" ON "dance_crews"("name");

-- CreateIndex
CREATE UNIQUE INDEX "votes_fingerprint_key" ON "votes"("fingerprint");

-- CreateIndex
CREATE INDEX "votes_crewId_idx" ON "votes"("crewId");

-- CreateIndex
CREATE INDEX "votes_fingerprint_idx" ON "votes"("fingerprint");

-- CreateIndex
CREATE INDEX "votes_timestamp_idx" ON "votes"("timestamp");

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "dance_crews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

