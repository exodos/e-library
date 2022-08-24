import NextAuth, { NextAuthOptions } from "next-auth";
// import type { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
import Credentials from "next-auth/providers/credentials";

// import prisma from "../../../helper/prisma";
import prisma from "../../../utils/prisma";
import { verifyPassword } from "../../../lib/auth";
let userAccount = null;

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const user = await prisma.user.findFirst({
            where: {
              userName: credentials?.username,
            },
          });
          if (user) {
            const isValid = await verifyPassword(
              credentials?.password,
              user.password
            );
            if (isValid) {
              return user;
            } else {
              console.log("Hash Not Matched To Logging In");
              return null;
            }
          } else {
            return null;
          }
        } catch (err) {
          console.log("Authorization error: ", err);
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/sign-in",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.oracleId;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.email = user.email;
        token.role = user.role;
      }

      return token;
    },
    session: async ({ session, token }) => {
      return { ...session, user: token };
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 10 * 60,
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
};

export default NextAuth(authOptions);
