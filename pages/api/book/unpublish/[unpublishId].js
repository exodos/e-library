import nc from "next-connect";
import prisma from "../../../../utils/prisma";

const handler = nc({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found");
  },
}).put(async (req, res) => {
  const bookId = req.query.unpublishId;
  try {
    const unpublished = await prisma.book.update({
      where: {
        id: Number(bookId),
      },
      data: {
        published: false,
      },
    });
    res.status(200).json(unpublished);
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Error occured while adding a new Book" });
  }
});

export default handler;
