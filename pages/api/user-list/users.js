import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import prisma from "../../../utils/prisma";

const secret = process.env.NEXTAUTH_SECRET;

const handler = async (req, res) => {
  const token = await getToken({ req, secret });
  if (token) {
    const userId = token.id;
    try {
      const user = await prisma.user.findUnique({
        where: {
          oracleId: parseInt(userId),
        },
      });
      // console.log(user);
      res.json(user);
    } catch (err) {
      console.log(err);
      res.json({ message: err.message });
    }
  } else {
    res.status(401).json({ message: "Not Logged In" });
  }
};

export default handler;
