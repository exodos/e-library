import prisma from "../../../utils/prisma";

const getVisitors = async (req, res, next) => {
  const bookId = req.query.book;
  const userId = req.query.user;

  const result = await prisma.Visitor.findFirst({
    where: {
      bookId: parseInt(bookId),
      userId: parseInt(userId),
    },
  });
  if (result) {
    res.status(200).send();
  } else {
    res.status(404).send();
  }
};

export default getVisitors;
