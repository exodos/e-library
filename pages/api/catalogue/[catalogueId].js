import prisma from "../../../utils/prisma";

const handler = async (req, res) => {
  const cId = req.query.catalogueId;
  const today = new Date();
  if (req.method === "PUT") {
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
      const result = await prisma.Catalogue.update({
        where: {
          id: Number(cId),
        },
        data: {
          bookTitle: bookTitle,
          bookYear: parseInt(bookYear),
          bookAuthor: bookAuthor,
          bookPublisher: bookPublisher,
          bookIsbn: bookIsbn,
          shelfNumber: parseInt(shelfNumber),
          rawNumber: parseInt(rawNumber),
          updatedAt: today,
        },
      });
      res.status(200).json(result);
    } catch (err) {
      console.error(err);
    }
  } else if (req.method === "DELETE") {
    try {
      const result = await prisma.Catalogue.delete({
        where: {
          id: Number(cId),
        },
      });
      res.status(200).json(result);
    } catch (err) {
      console.error(err);
      res.status(403).json({ err: "Error occured while deleting a new book." });
    }
  }
};

export default handler;
