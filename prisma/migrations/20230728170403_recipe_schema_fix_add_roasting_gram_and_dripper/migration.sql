/*
  Warnings:

  - Added the required column `dripper` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gram` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roasting` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "dripper" TEXT NOT NULL,
ADD COLUMN     "gram" INTEGER NOT NULL,
ADD COLUMN     "roasting" TEXT NOT NULL;
