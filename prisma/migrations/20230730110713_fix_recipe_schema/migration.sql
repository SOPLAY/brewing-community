/*
  Warnings:

  - You are about to drop the column `totalTime` on the `Recipe` table. All the data in the column will be lost.
  - Added the required column `degrees` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stepCnt` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "totalTime",
ADD COLUMN     "degrees" INTEGER NOT NULL,
ADD COLUMN     "stepCnt" INTEGER NOT NULL;
