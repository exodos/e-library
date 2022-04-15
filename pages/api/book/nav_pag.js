import prisma from "../../../utils/prisma";
import { getSession } from "next-auth/react";

const NavPagination = async (req, res, next) => {
  // const session = await getSession({ req });
  // if (!session) {
  const curPage = req.query.page || 1;
  const nav = req.query.slug;
  const perPage = 10;

  try {
    const [books, totalBooks] = await prisma.$transaction([
      prisma.Book.findMany({
        skip: (curPage - 1) * perPage,
        take: perPage,
        where: {
          published: true,
          bookRecommendedBy: nav,
        },
        orderBy: {
          updatedAt: "desc",
        },
      }),
      prisma.Book.count({
        where: {
          published: true,
          bookRecommendedBy: nav,
        },
      }),
    ]);

    res.status(200).json({
      message: "Fetched books",
      books: books,
      curPage: curPage,
      maxPage: Math.ceil(totalBooks / perPage),
      totalBooks: totalBooks,
      perPage: perPage,
    });
  } catch (err) {
    res.status(403).json({ err: "Error." });
  }

  // } else {
  //   // Not Signed in
  //   res.status(403).json({ message: "Not Signed In" });
  // }
};

export default NavPagination;
