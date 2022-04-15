const ldap = require("ldapjs");
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

const ldapUrl = `ldap://${process.env.LDAP_SERVER}`;
const prisma = new PrismaClient();

const authenticate = async (username, password) => {
  const client = ldap.createClient({
    url: ldapUrl,
  });
  const entries = [];

  return new Promise((resolve, reject) => {
    client.bind(`${username}@${process.env.LDAP_DOMAIN}`, password, (error) => {
      if (error) {
        reject("Wrong email or password.");
      } else {
        const opts = {
          filter: `(sAMAccountName=${username})`,
          scope: "sub",
          attributes: [
            // "dn",
            // "sn",
            // "cn",
            "mail",
            "employeeid",
            "title",
            "name",
            "division",
            "department",
            // "section",
          ],
        };

        client.search(process.env.LDAP_BASE_DN, opts, (err, res) => {
          if (err) {
            reject(`User ${username} LDAP search error`);
          } else {
            res.on("searchRequest", (searchRequest) => {
              // console.log("saerchRequest: ", searchRequest.messageID);
            });
            res.on("searchEntry", (entry) => {
              entries.push(entry.object);

              // client.bind(entry.dn, password, (err, res) => {
              //   if (err) {
              //     reject(`User ${username} username or password problem`);
              //   } else {
              //     resolve({
              //       username,
              //       password,
              //     });
              //   }
              // });
            });

            // res.on("searchReference", (referral) => {
            // console.log("referral: " + referral.uris.join());
            // });
            res.on("error", (err) => {
              reject("LDAP SEARCH error");
            });
            res.on("end", async (result) => {
              if (entries.length == 0) {
                reject(`User ${username} username or password problem`);
              }
              console.log({ entries });

              const searchResult = JSON.stringify(entries[0]);
              const adEmployee = JSON.parse(searchResult);
              const empId = adEmployee?.employeeID;
              const jobRole = adEmployee?.title;
              const fullName = adEmployee.name;
              const division = adEmployee?.division;
              const department = adEmployee?.department;
              const section = adEmployee?.section;
            });
          }
        });
      }
    });
  });
};

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    encryption: true,
  },
  pages: {
    signIn: "/auth/sign-in",
    // signOut: "/auth/sign-in",
    error: "/auth/sign-in",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.username = user.username;
        token.password = user.password;
      }
      return token;
    },
    session: async ({ session, token }) => {
      // if (token) {
      //   session.id = token.id;
      //   session.username = token.username;
      // }
      // return session;

      session.type = token.type;
      session.username = token.username;

      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "LDAP",
      authorize: async (credentials, req) => {
        const { username, password } = credentials;
        if (!username || !password) {
          throw new Error("enter username and password");
        }
        try {
          await authenticate(username, password);
          const newUser = await prisma.user.findUnique({});
          return {
            username,
            password,
          };
        } catch (err) {
          console.log(err);
          throw new Error(err);
        }
      },
    }),
  ],
});
