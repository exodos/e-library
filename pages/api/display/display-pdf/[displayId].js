import prisma from "../../../../utils/prisma";
const handler = async (req, res) => {
  const bookId = req.query.displayId;
  try {
    const book = await prisma.Book.findUnique({
      where: {
        id: parseInt(bookId),
      },
    });

    res.status(200).json(book);
  } catch (err) {
    res.status(403).json({ err: "Error getting book." });
  }
};

export default handler;
