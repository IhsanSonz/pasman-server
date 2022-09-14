/*
  Warnings:

  - You are about to drop the column `encrypted` on the `Password` table. All the data in the column will be lost.
  - You are about to drop the column `iv` on the `Password` table. All the data in the column will be lost.
  - Added the required column `pass` to the `Password` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Password" DROP COLUMN "encrypted",
DROP COLUMN "iv",
ADD COLUMN     "pass" TEXT NOT NULL;
