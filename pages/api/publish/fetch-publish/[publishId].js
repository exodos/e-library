import prisma from "../../../../utils/prisma";

const handler = async (req, res) => {
  const publishId = req.query.publishId;
  console.log(
    "🚀 ~ file: [publishId].js ~ line 5 ~ handler ~ publishId",
    publishId
  );
  try {
    const result = await prisma.Book.findUnique({
      where: {
        id: parseInt(publishId),
      },
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(403).json({ err: "Error getting book." });
  }
};

export default handler;
