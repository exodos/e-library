import { getSession } from "next-auth/react";
import nc from "next-connect";
import prisma from "../../../utils/prisma";
import { Prisma } from "@prisma/client";

const handler = nc({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found");
  },
})
  .use(async (req, res, next) => {
    const session = await getSession({ req });
    if (!session) {
      res.status(401).json({ message: "unauthenticated" });
      // next();
    } else {
      next();
    }
  })
  // .use(async (req, res, next) => {
  //   const { shelfNumber, rawNumber } = req.body;
  //   const check = await prisma.Catalogue.findFirst({
  //     where: {
  //       shelfNumber: parseInt(shelfNumber),
  //       rawNumber: parseInt(rawNumber),
  //     },
  //   });
  //   if (check) {
  //     res
  //       .status(403)
  //       .json({ message: "Shelf Number And Raw Number Already Existed" });
  //   } else {
  //     next();
  //   }
  // })
  .post(async (req, res) => {
    const {
      bookTitle,
      bookYear,
      bookAuthor,
      bookPublisher,
      bookIsbn,
      shelfNumber,
      rawNumber,
    } = req.body;

    try {
      const result = await prisma.Catalogue.create({
        data: {
          bookTitle: bookTitle,
          bookYear: parseInt(bookYear),
          bookAuthor: bookAuthor,
          bookPublisher: bookPublisher,
          bookIsbn: bookIsbn,
          shelfNumber: parseInt(shelfNumber),
          rawNumber: parseInt(rawNumber),
        },
      });
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ err: "Error occured while adding a new catalogue" });
    }
  });

export default handler;
