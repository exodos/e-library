const ldap = require("ldapjs");
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";

const url = `ldap://${process.env.LDAP_SERVER}`;
const prisma = new PrismaClient();

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "LDAP",
      credentials: {
        username: { label: "DN", type: "text", placeholder: "" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, req) => {
        // You might want to pull this call out so we're not making a new LDAP client on every login attemp
        const client = ldap.createClient({
          url: url,
        });

        return new Promise((resolve, reject) => {
          client.bind(
            `${credentials.username}@${process.env.LDAP_DOMAIN}`,
            credentials.password,
            (error) => {
              if (error) {
                console.log(error);
                reject("Wrong email or password.");
              } else {
                console.log("Successfully Logged In");
                resolve({
                  username: credentials.username,
                  password: credentials.password,
                });
              }
              const filter = `(sAMAccountName=${credentials.username})`;

              client.search(
                process.env.LDAP_BASE_DN,
                {
                  filter,
                  scope: "sub",
                  attributes: [
                    "mail",
                    "employeeid",
                    "title",
                    "name",
                    "division",
                    "department",
                    "section",
                  ],
                },
                (err, results) => {
                  if (err) {
                    reject(`User ${username} LDAP search error`);
                  }

                  const entries = [];

                  results.on("searchEntry", (entry) => {
                    entries.push(entry.object);
                  });

                  results.on("error", (err) => {
                    console.log(err);
                    reject("LDAP SEARCH error");
                  });

                  results.on("end", async (result) => {
                    if (entries.length == 0) {
                      reject("Something went wrong. Please try again. (AD)");
                    }

                    console.log({ entries });

                    const searchResult = JSON.stringify(entries[0]);
                    const adEmployee = JSON.parse(searchResult);
                    const empId = adEmployee?.employeeID;
                    const fullName = adEmployee.name;
                    const jobRole = adEmployee?.title;
                    const role = jobRole.split(" ").slice(-1);
                    const email = adEmployee?.mail;
                    const division = adEmployee?.division;
                    const department = adEmployee?.department;
                    const section = adEmployee?.section;

                    const body = {
                      empId,
                      fullName,
                      role,
                      email,
                      division,
                      department,
                      section,
                    };

                    console.log(body);

                    const newUser = await prisma.user.findUnique({
                      where: {
                        oracleId: empId,
                      },
                    });

                    if (!newUser) {
                      await prisma.user.create({
                        data: {
                          oracleId: empId,
                          fullName: fullName,
                          jobRole: role,
                          email: email,
                          division: division,
                          department: department,
                          section: section,
                        },
                      });
                    }
                  });
                }
              );
            }
          );
        });
      },
    }),
  ],
  pages: {
    signIn: "/auth/sign-in",
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
      if (token) {
        session.type = token.type;
        session.id = token.id;
        session.username = token.username;
      }
      // console.log(token);
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    encryption: true,
  },
});
