-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "fileId" TEXT,
ALTER COLUMN "href" SET DEFAULT '';

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "MediaFile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
