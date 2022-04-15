import prisma from "../../../../utils/prisma";

const visitors = async (req, res, next) => {
  const curPage = req.query.page || 1;
  const searchBook = req.query.search;
  const dateFrom = req.query.dateFrom;
  const dateTo = req.query.dateTo;

  const perPage = 10;
  let visitors = null;
  let totalVisitor = null;

  try {
    if (searchBook != null) {
      [visitors, totalVisitor] = await prisma.$transaction([
        prisma.visitor.findMany({
          skip: (curPage - 1) * perPage,
          take: perPage,
          where: {
            book: {
              bookTitle: {
                contains: searchBook,
                mode: "insensitive",
              },
            },
          },
          include: {
            book: true,
            user: true,
          },
          orderBy: {
            visitedAt: "desc",
          },
        }),
        prisma.visitor.count({
          where: {
            book: {
              bookTitle: {
                contains: searchBook,
                mode: "insensitive",
              },
            },
          },
        }),
      ]);
    } else if (dateFrom != null && dateTo != null) {
      [visitors, totalVisitor] = await prisma.$transaction([
        prisma.visitor.findMany({
          skip: (curPage - 1) * perPage,
          take: perPage,
          where: {
            visitedAt: {
              lte: new Date(`${dateTo}`),
              gte: new Date(`${dateFrom}`),
            },
          },
          include: {
            book: true,
            user: true,
          },
          orderBy: {
            visitedAt: "desc",
          },
        }),
        prisma.visitor.count({
          where: {
            visitedAt: {
              lte: new Date(`${dateTo}`),
              gte: new Date(`${dateFrom}`),
            },
          },
        }),
      ]);
    } else {
      [visitors, totalVisitor] = await prisma.$transaction([
        prisma.visitor.findMany({
          skip: (curPage - 1) * perPage,
          take: perPage,
          include: {
            book: true,
            user: true,
          },
          orderBy: {
            visitedAt: "desc",
          },
        }),
        prisma.visitor.count(),
      ]);
    }

    res.status(200).json({
      message: "Fetched Books",
      visitors: visitors,
      maxPage: Math.ceil(totalVisitor / perPage),
      totalVisitor: totalVisitor,
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Failed To Fetch!" });
  }
};

export default visitors;
