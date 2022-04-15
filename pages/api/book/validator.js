import prisma from "../../../utils/prisma";

const Validator = async (req, res) => {
  const isbn = req.query.isbn;
  const isbnCount = await prisma.Book.count({
    where: {
      bookIsbn: isbn,
    },
  });

  res.json(isbnCount);
};

export default Validator;
