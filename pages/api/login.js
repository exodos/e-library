import { getCsrfToken } from "next-auth/react";

export default async (req, res) => {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (token) {
    console.log("JSON Web Token", JSON.stringify(token, null, 2));
    const { username, password } = token;
    res.send({
      token: token,
    });
  } else {
    res.status(401);
  }
  res.end();
};
