import prisma from "../../../../utils/prisma";

const handler = async (req, res) => {
  const bookId = req.query.bookId;
  try {
    const result = await prisma.Book.findUnique({
      where: {
        id: parseInt(bookId),
      },
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(403).json({ err: "Error getting book." });
  }
};

export default handler;
