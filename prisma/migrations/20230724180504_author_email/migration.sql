/*
  Warnings:

  - A unique constraint covering the columns `[email,id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authorEmail` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorEmail` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "authorEmail" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "authorEmail" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_id_key" ON "User"("email", "id");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_authorEmail_fkey" FOREIGN KEY ("authorId", "authorEmail") REFERENCES "User"("id", "email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_authorEmail_fkey" FOREIGN KEY ("authorId", "authorEmail") REFERENCES "User"("id", "email") ON DELETE CASCADE ON UPDATE CASCADE;
