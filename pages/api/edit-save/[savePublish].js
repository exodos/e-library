import prisma from "../../../utils/prisma";
import { getSession } from "next-auth/react";

const handler = async (req, res) => {
  const edit = req.query.savePublish;
  const today = new Date();
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
        published: true,
        updatedAt: today,
      },
    });
    res.status(200).json(publish);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Error occured while adding a new book." });
  }
};

export default handler;
