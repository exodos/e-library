import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

export default async (req, res) => {
  const token = await getToken({ req, secret });

  if (token) {
    const uId = token.id;
    console.log(uId);
    // console.log(username);
  } else {
    // Not Signed in
    res.status(401);
  }
  res.end();
};
