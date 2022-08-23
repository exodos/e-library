-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'CONTRIBUTOR', 'ADMIN');

-- CreateTable
CREATE TABLE "users" (
    "oracleId" INTEGER NOT NULL,
    "user_name" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "job_role" TEXT,
    "email" TEXT NOT NULL,
    "division" TEXT,
    "department" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "users_pkey" PRIMARY KEY ("oracleId")
);

-- CreateTable
CREATE TABLE "books" (
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

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitors" (
    "book_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "visitedAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visitors_pkey" PRIMARY KEY ("book_id","user_id")
);

-- CreateTable
CREATE TABLE "catalogues" (
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

    CONSTRAINT "catalogues_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_user_name_key" ON "users"("user_name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "books_book_isbn_key" ON "books"("book_isbn");

-- CreateIndex
CREATE UNIQUE INDEX "catalogues_bookIsbn_key" ON "catalogues"("bookIsbn");

-- AddForeignKey
ALTER TABLE "visitors" ADD CONSTRAINT "visitors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("oracleId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitors" ADD CONSTRAINT "visitors_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;
