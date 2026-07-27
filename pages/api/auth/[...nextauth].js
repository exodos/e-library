const ldap = require("ldapjs");
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "../../../utils/prisma";

const url = `ldap://${process.env.LDAP_SERVER}`;

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "LDAP",
      credentials: {
        username: { label: "DN", type: "text", placeholder: "" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const { username, password } = credentials || {};
        if (!username || !password) {
          throw new Error("Please enter username and password");
        }

        const client = ldap.createClient({
          url,
        });

        return new Promise((resolve, reject) => {
          client.bind(
            `${username}@${process.env.LDAP_DOMAIN}`,
            password,
            (error) => {
              if (error) {
                console.log(error);
                client.unbind();
                return reject(new Error("Wrong username or password."));
              }

              const filter = `(sAMAccountName=${username})`;

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
                    client.unbind();
                    return reject(
                      new Error(`User ${username} LDAP search error`)
                    );
                  }

                  const entries = [];

                  results.on("searchEntry", (entry) => {
                    entries.push(entry.object);
                  });

                  results.on("error", (searchError) => {
                    console.log(searchError);
                    client.unbind();
                    reject(new Error("LDAP SEARCH error"));
                  });

                  results.on("end", async () => {
                    try {
                      if (entries.length === 0) {
                        throw new Error(
                          "Something went wrong. Please try again. (AD)"
                        );
                      }

                      const adEmployee = entries[0];
                      const empId = adEmployee?.employeeID;
                      const fullName = adEmployee.name;
                      const jobRole = adEmployee?.title;
                      const [arrayRole] = (jobRole || "").split(" ").slice(-1);
                      const email = adEmployee?.mail;
                      const division = adEmployee?.division;
                      const department = adEmployee?.department;
                      let role = "USER";

                      if (!empId) {
                        throw new Error("Employee ID missing from AD");
                      }

                      let user = await prisma.user.findUnique({
                        where: {
                          oracleId: parseInt(empId, 10),
                        },
                      });

                      if (!user) {
                        if (
                          arrayRole === "Officer" ||
                          arrayRole === "Director"
                        ) {
                          role = "CONTRIBUTOR";
                        }

                        user = await prisma.user.create({
                          data: {
                            oracleId: parseInt(empId, 10),
                            userName: username,
                            fullName,
                            jobRole,
                            email,
                            division,
                            department,
                            role,
                          },
                        });
                      }

                      resolve(user);
                    } catch (err) {
                      console.log(err);
                      reject(err);
                    } finally {
                      client.unbind();
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
    error: "/auth/sign-in",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.oracleId;
        token.username = user.userName;
        token.role = user.role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.id = token.id;
        session.username = token.username;
        session.role = token.role;
        session.user = {
          ...(session.user || {}),
          id: token.id,
          name: token.username,
          role: token.role,
        };
      }
      return session;
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
});
