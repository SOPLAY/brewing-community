/*
  Warnings:

  - A unique constraint covering the columns `[id,email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authorEmail` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "authorEmail" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_id_email_key" ON "User"("id", "email");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_authorEmail_fkey" FOREIGN KEY ("authorId", "authorEmail") REFERENCES "User"("id", "email") ON DELETE CASCADE ON UPDATE CASCADE;
