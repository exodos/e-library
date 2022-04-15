import prisma from "../../../utils/prisma";
import { getSession } from "next-auth/react";

const handler = async (req, res) => {
  // const session = await getSession({ req });
  const today = new Date();
  // if (!session) {
  const edit = req.query.editId;
  const {
    bookTitle,
    bookDescription,
    bookYear,
    bookAuthor,
    bookPublisher,
    bookIsbn,
    bookRecommendedBy,
    bookCategory,
  } = req.body;
  try {
    const publish = await prisma.Book.update({
      where: {
        id: Number(edit),
      },
      data: {
        bookTitle: bookTitle,
        bookDescription: bookDescription,
        bookYear: Number(bookYear),
        bookAuthor: bookAuthor,
        bookPublisher: bookPublisher,
        bookIsbn: bookIsbn,
        bookRecommendedBy: bookRecommendedBy,
        bookCategory: bookCategory,
        updatedAt: today,
      },
    });
    res.status(200).json(publish);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Error occured while adding a new book." });
  }

  // } else {
  //   // Not Signed in
  //   res.status(403).json({ message: "Not Signed In" });
  // }
  // res.end();
};

export default handler;
