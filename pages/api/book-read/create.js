import { date } from "yup";
import prisma from "../../../utils/prisma";

const handler = async (req, res) => {
  const { bookId, userId } = req.body;

  try {
    await prisma.Visitor.create({
      data: {
        book: {
          connect: { id: bookId },
        },
        user: {
          connect: { oracleId: userId },
        },
      },
    });

    // await prisma.$transaction([
    //   prisma.Visitor.create({
    //     data: {
    //       book: {
    //         connect: { id: bookId },
    //       },
    //       user: {
    //         connect: { oracleId: userId },
    //       },
    //     },
    //   }),
    //   prisma.Book.update({
    //     where: {
    //       id: parseInt(bookId),
    //     },
    //     data: {
    //       readAt: new Date(),
    //     },
    //   }),
    // ]);
    res.status(200).json({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Error." });
  }
};

export default handler;
