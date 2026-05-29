-- CreateTable
CREATE TABLE "Providers" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "contactInfo" TEXT NOT NULL,
    "createAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Providers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Providers_id_idx" ON "Providers"("id");
