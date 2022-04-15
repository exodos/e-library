import prisma from "../../../utils/prisma";
import { getSession } from "next-auth/react";

const hadle = async (req, res) => {
  const session = await getSession({ req });
  const today = new Date();
  if (session) {
    const publishId = req.query.publishId;
    if (req.method === "PUT") {
      try {
        const publish = await prisma.Book.update({
          where: {
            id: Number(publishId),
          },
          data: {
            published: true,
            updatedAt: today,
          },
        });
        res.status(200).json(publish);
      } catch (err) {
        console.log(err);
        res.status(403).json({ err: "Error occured while adding a new book." });
      }
    } else if (req.method === "DELETE") {
      try {
        const delteBook = await prisma.Book.delete({
          where: {
            id: Number(publishId),
          },
        });
        res.status(200).json(delteBook);
      } catch (err) {
        console.log(err);
        res
          .status(403)
          .json({ err: "Error occured while deleting a new book." });
      }
    }
  } else {
    // Not Signed in
    res.status(403).json({ message: "Not Signed In" });
  }
};

export default hadle;
