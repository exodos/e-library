import prisma from "../../../utils/prisma";

const handler = async (req, res) => {
  try {
    const visitors = await prisma.visitor.findMany({
      include: {
        book: true,
        user: true,
      },
      orderBy: {
        visitedAt: "desc",
      },
    });
    res.status(200).json({ visitors: visitors });
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Failed To Fetch!" });
  }
};

export default handler;
