const { PrismaClient } = require("@prisma/client");
const { getSession } = require("next-auth/react");
const prisma = new PrismaClient();
const main = async (req, res) => {
  const session = await getSession({ req });
  console.log(session);
};

main();
