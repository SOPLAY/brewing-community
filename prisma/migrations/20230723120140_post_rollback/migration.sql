/*
  Warnings:

  - You are about to drop the column `authorEmail` on the `Post` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_authorEmail_fkey";

-- DropIndex
DROP INDEX "User_id_email_key";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "authorEmail";

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
