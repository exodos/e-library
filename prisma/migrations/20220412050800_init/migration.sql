-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'CONTRIBUTOR', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "oracleId" INTEGER NOT NULL,
    "user_name" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "job_role" TEXT,
    "email" TEXT NOT NULL,
    "division" TEXT,
    "department" TEXT,
    "role" "Role" NOT NULL DEFAULT E'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("oracleId")
);

-- CreateTable
CREATE TABLE "Book" (
    "id" SERIAL NOT NULL,
    "book_title" TEXT NOT NULL,
    "book_description" TEXT NOT NULL,
    "book_year" INTEGER NOT NULL,
    "book_author" TEXT NOT NULL,
    "book_publisher" TEXT NOT NULL,
    "book_isbn" TEXT NOT NULL,
    "book_recommended_by" TEXT NOT NULL,
    "book_category" TEXT NOT NULL,
    "book_url" TEXT NOT NULL,
    "book_thumb" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "book_rating" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATE NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visitor" (
    "book_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "visitedAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Visitor_pkey" PRIMARY KEY ("book_id","user_id")
);

-- CreateTable
CREATE TABLE "Catalogue" (
    "id" SERIAL NOT NULL,
    "book_title" TEXT NOT NULL,
    "book_year" INTEGER NOT NULL,
    "bookAuthor" TEXT NOT NULL,
    "bookPublisher" TEXT NOT NULL,
    "bookIsbn" TEXT NOT NULL,
    "shelfNumber" INTEGER NOT NULL,
    "rawNumber" INTEGER NOT NULL,
    "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Catalogue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_user_name_key" ON "User"("user_name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Book_book_isbn_key" ON "Book"("book_isbn");

-- CreateIndex
CREATE UNIQUE INDEX "Catalogue_bookIsbn_key" ON "Catalogue"("bookIsbn");

-- AddForeignKey
ALTER TABLE "Visitor" ADD CONSTRAINT "Visitor_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("oracleId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visitor" ADD CONSTRAINT "Visitor_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
