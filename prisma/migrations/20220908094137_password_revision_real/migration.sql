/*
  Warnings:

  - You are about to drop the column `password` on the `Password` table. All the data in the column will be lost.
  - Added the required column `encrypted` to the `Password` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Password" DROP COLUMN "password",
ADD COLUMN     "encrypted" TEXT NOT NULL;
