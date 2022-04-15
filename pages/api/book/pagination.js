import prisma from "../../../utils/prisma";
import { getSession } from "next-auth/react";

const getBooks = async (req, res, next) => {
  const curPage = req.query.page || 1;
  const searchBook = req.query.search;
  const perPage = 10;
  let books = null;
  let totalBooks = null;

  try {
    if (searchBook === undefined) {
      [books, totalBooks] = await prisma.$transaction([
        prisma.book.findMany({
          skip: (curPage - 1) * perPage,
          take: perPage,
          where: {
            published: true,
          },
          orderBy: {
            updatedAt: "desc",
          },
        }),
        prisma.book.count({
          where: {
            published: true,
          },
        }),
      ]);
    } else {
      [books, totalBooks] = await prisma.$transaction([
        prisma.book.findMany({
          skip: (curPage - 1) * perPage,
          take: perPage,
          where: {
            published: true,
            bookTitle: {
              contains: searchBook,
              mode: "insensitive",
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
        }),
        prisma.book.count({
          where: {
            published: true,
            bookTitle: {
              contains: searchBook,
              mode: "insensitive",
            },
          },
        }),
      ]);
    }

    res.status(200).json({
      message: "Fetched Books",
      books: books,
      maxPage: Math.ceil(totalBooks / perPage),
      totalBooks: totalBooks,
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Failed To Fetch!" });
  }
};

export default getBooks;
