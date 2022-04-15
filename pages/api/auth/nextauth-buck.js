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
                console.log("Wrong email or password.");
                reject("Wrong email or password.");
              } else {
                console.log("Successfully Logged In");
                resolve({
                  username: credentials.username,
                  password: credentials.password,
                });
              }
              // const filter = `(sAMAccountName=${username})`;
              const filter = `(sAMAccountName=${credentials.username})`;

              client.search(
                process.env.LDAP_BASE_DN,
                { filter, scope: "sub", attributes: ["mail", "employeeid"] },
                (err, results) => {
                  if (err) {
                    reject(`User ${username} LDAP search error`);
                  }

                  const entries = [];

                  results.on("searchEntry", (entry) => {
                    entries.push(entry.object);
                    //   entries.push(entry);
                  });

                  results.on("error", (err) => {
                    reject("LDAP SEARCH error");
                  });

                  //   results.on("end", async(result) => {
                  //     if (entries.length == 0) {
                  //       reject("Something went wrong. Please try again. (AD)");
                  //     }
                  //   });
                  results.on("end", (result) => {
                    if (entries.length == 0) {
                      reject("Something went wrong. Please try again. (AD)");
                    }

                    console.log({ entries });

                    /*
                    const searchResult = JSON.stringify(entries[0]);
                    const adEmployee = JSON.parse(searchResult);
                    const empId = adEmployee?.employeeID;

                    const employee = await prisma.Employee.findMany({
                      where: {
                        oracleId: empId,
                      },
                    });

                    if (!employee) {
                      resolve("Something went wrong. Please try again. (AD)");
                    }

                    const user = await prisma.user.findMany({
                      where: {
                        oracleId: empId,
                      },
                    });

                    const {
                      oracleId,
                      fullName,
                      jobRole,
                      email,
                      employeeCategory,
                      division,
                      department,
                      section,
                    } = employee;

                    if (!user) {
                      await prisma.user.create({
                        data: {
                          oracleId: oracleId,
                          fullName: fullName,
                          jobRole: jobRole,
                          email: email,
                          employeeCategory: employeeCategory,
                          division: division,
                          department: department,
                          section: section,
                        },
                      });
                    }
                    */
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
        session.id = token.id;
        session.username = token.username;
      }
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
