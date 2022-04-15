import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default NextAuth({
  // adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "username", type: "email", placeholder: "" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, req) => {
        const username = credentials.username;
        const password = credentials.password;

        const emp = await prisma.employee.findFirst({
          where: {
            email: username,
            password,
          },
        });

        // console.log({ emp });

        if (!emp) {
          return null;
        }

        const user = await prisma.user.findFirst({
          where: {
            oracleId: emp.oracleId,
          },
        });

        if (user) {
          return {
            id: user.oracleId,
            name: user.fullName,
            email: user.email,
          };
        } else {
          const createUser = await prisma.user.create({
            data: {
              oracleId: emp.oracleId,
              fullName: emp.fullName,
              jobRole: emp.jobRole,
              email: emp.email,
              employeeCategory: emp.employeeCategory,
              division: emp.division,
              department: emp.department,
              section: emp.section,
            },
          });
          if (createUser) {
            return {
              id: emp.oracleId,
              name: emp.fullName,
              email: emp.email,
            };
          } else {
            return null;
          }
        }

        // if (
        //   credentials.username === "tsegaye.gselassie" &&
        //   credentials.password === "KotlinX1dm2n"
        // ) {
        //   return {
        //     id: 6674,
        //     name: "Tsegay Gebreselassie",
        //     email: "tsegaye.gebreselassie@ethiotelecom.et",
        //   };
        // } else if (
        //   credentials.username === "samuel.dadi" &&
        //   credentials.password === "test"
        // ) {
        //   return {
        //     id: 2709,
        //     name: "Samuel Dadi",
        //     email: "samuel.dadi@ethiotelecom.et",
        //   };
        // } else if (
        //   credentials.username === "naod.abdurahman" &&
        //   credentials.password === "test"
        // ) {
        //   return {
        //     id: 7084,
        //     name: "Naod Abdurahman",
        //     email: "naod.abdurahman@ethiotelecom.et",
        //   };
        // }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/sign-in",
    // signOut: "/auth/sign-in",
    error: "/auth/sign-in",
  },
  callbacks: {
    signIn: async ({ user, account, profile, email, credentials }) => {
      const isAllowedToSignIn = true;
      if (isAllowedToSignIn) {
        return true;
      } else {
        return false;
      }
    },
    redirect: async ({ url, baseUrl }) => {
      return baseUrl;
    },

    jwt: async ({ token, user }) => {
      const isSignIn = user ? true : false;
      if (isSignIn) {
        token.id = user.id;
        token.username = user.username;
        token.password = user.password;
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.id = token.id;
        session.username = token.username;
        session.password = token.password;
      }
      return session;
      // return { ...session, user: { username: token.username } };
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    encryption: true,
  },
});
