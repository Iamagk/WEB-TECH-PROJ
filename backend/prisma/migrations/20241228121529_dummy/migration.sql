-- CreateTable
CREATE TABLE "Student" (
    "usn" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("usn")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_usn_key" ON "Student"("usn");

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");
