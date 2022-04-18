import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import prisma from "../../../utils/prisma";

const secret = process.env.NEXTAUTH_SECRET;

const handler = async (req, res) => {
  const token = await getToken({ req, secret });
  const userId = token.id;
  // const session = await getSession({ req });

  try {
    const user = await prisma.user.findUnique({
      where: {
        oracleId: parseInt(userId),
        // oracleId: 6674,
      },
    });
    console.log(user);
    res.json(user);
  } catch (err) {
    console.log(err);
    res.json({ message: err.message });
    // res.status(403).json({ message: err.message });
  }
};

export default handler;
