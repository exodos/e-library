import prisma from "../../../utils/prisma";
import { getSession } from "next-auth/react";

const getCatalogue = async (req, res, next) => {
  const curPage = req.query.page || 1;
  const searchCatalogue = req.query.search;
  const perPage = 10;
  let catalogue = null;
  let totalCatalogue = null;
  // console.log(searchBook);

  try {
    if (searchCatalogue === undefined) {
      [catalogue, totalCatalogue] = await prisma.$transaction([
        prisma.Catalogue.findMany({
          skip: (curPage - 1) * perPage,
          take: perPage,
          orderBy: [
            {
              shelfNumber: "asc",
            },
            {
              rawNumber: "asc",
            },
          ],
        }),
        prisma.Catalogue.count(),
      ]);
    } else {
      [catalogue, totalCatalogue] = await prisma.$transaction([
        prisma.Catalogue.findMany({
          skip: (curPage - 1) * perPage,
          take: perPage,
          where: {
            bookTitle: {
              contains: searchCatalogue,
              mode: "insensitive",
            },
          },
          orderBy: [
            {
              shelfNumber: "asc",
            },
            {
              rawNumber: "asc",
            },
          ],
        }),
        prisma.Catalogue.count({
          where: {
            bookTitle: {
              contains: searchCatalogue,
            },
          },
        }),
      ]);
    }
    // res.json(books);
    res.status(200).json({
      message: "Fetched Books",
      catalogue: catalogue,
      maxPage: Math.ceil(totalCatalogue / perPage),
      totalCatalogue: totalCatalogue,
    });
  } catch (err) {
    console.error(err);
  }
};

export default getCatalogue;
