const ldap = require("ldapjs");
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "../../../utils/prisma";

const url = `ldap://${process.env.LDAP_SERVER}`;

function attr(value) {
  if (value == null) return null;
  if (Array.isArray(value)) value = value[0];
  if (value == null) return null;
  const text = String(value).trim();
  return text || null;
}

function closeClient(client) {
  try {
    if (client && typeof client.unbind === "function") {
      client.unbind(() => {});
    }
  } catch (err) {
    // ignore cleanup errors
  }
}

function authError(message) {
  // NextAuth may put this into a Location header — keep it single-line/ASCII-safe.
  const safe = String(message || "Authentication failed")
    .replace(/[\r\n\t]+/g, " ")
    .trim();
  return new Error(safe);
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "LDAP",
      credentials: {
        username: { label: "DN", type: "text", placeholder: "" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const username = attr(credentials?.username);
        const password = credentials?.password;
        if (!username || !password) {
          throw authError("Please enter username and password");
        }

        const client = ldap.createClient({ url });
        client.on("error", (err) => {
          console.log("LDAP client error:", err?.message || err);
        });

        return new Promise((resolve, reject) => {
          const fail = (message, detail) => {
            if (detail) console.log("LDAP auth failure:", message, detail);
            else console.log("LDAP auth failure:", message);
            closeClient(client);
            reject(authError(message));
          };

          client.bind(
            `${username}@${process.env.LDAP_DOMAIN}`,
            password,
            (error) => {
              if (error) {
                return fail("Wrong username or password.", error);
              }

              client.search(
                process.env.LDAP_BASE_DN,
                {
                  filter: `(sAMAccountName=${username})`,
                  scope: "sub",
                  attributes: [
                    "mail",
                    "employeeID",
                    "employeeid",
                    "title",
                    "name",
                    "displayName",
                    "division",
                    "department",
                    "section",
                  ],
                },
                (err, results) => {
                  if (err) {
                    return fail("LDAP search failed.", err);
                  }

                  const entries = [];

                  results.on("searchEntry", (entry) => {
                    // ldapjs may expose .object or .pojo depending on version
                    entries.push(entry.object || entry.pojo || entry);
                  });

                  results.on("error", (searchError) => {
                    fail("LDAP search stream error.", searchError);
                  });

                  results.on("end", async () => {
                    try {
                      if (entries.length === 0) {
                        throw authError("User not found in Active Directory.");
                      }

                      const adEmployee = entries[0];
                      const empIdRaw =
                        attr(adEmployee.employeeID) ||
                        attr(adEmployee.employeeId) ||
                        attr(adEmployee.employeeid);
                      const empId = empIdRaw ? parseInt(empIdRaw, 10) : NaN;
                      const fullName =
                        attr(adEmployee.name) ||
                        attr(adEmployee.displayName) ||
                        username;
                      const jobRole = attr(adEmployee.title);
                      const email =
                        attr(adEmployee.mail) ||
                        `${username}@ethiotelecom.et`;
                      const division = attr(adEmployee.division);
                      const department = attr(adEmployee.department);
                      const lastTitleWord = (jobRole || "")
                        .split(/\s+/)
                        .filter(Boolean)
                        .slice(-1)[0];
                      let role = "USER";

                      if (!empIdRaw || Number.isNaN(empId)) {
                        throw authError(
                          "Employee ID missing or invalid in Active Directory."
                        );
                      }

                      let user = await prisma.user.findUnique({
                        where: { oracleId: empId },
                      });

                      if (!user) {
                        // username unique collision — reuse existing account if present
                        user = await prisma.user.findUnique({
                          where: { userName: username },
                        });
                      }

                      if (!user) {
                        if (
                          lastTitleWord === "Officer" ||
                          lastTitleWord === "Director"
                        ) {
                          role = "CONTRIBUTOR";
                        }

                        try {
                          user = await prisma.user.create({
                            data: {
                              oracleId: empId,
                              userName: username,
                              fullName,
                              jobRole,
                              email,
                              division,
                              department,
                              role,
                            },
                          });
                        } catch (createErr) {
                          // email unique collision: try find by email then username
                          console.log(
                            "User create failed:",
                            createErr?.code,
                            createErr?.message
                          );
                          user =
                            (await prisma.user.findUnique({
                              where: { email },
                            })) ||
                            (await prisma.user.findUnique({
                              where: { userName: username },
                            }));

                          if (!user) {
                            throw authError(
                              "Could not create user account. Contact admin."
                            );
                          }
                        }
                      }

                      closeClient(client);
                      resolve(user);
                    } catch (err) {
                      fail(
                        err?.message || "Authentication failed.",
                        err
                      );
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
    redirect: async ({ url, baseUrl }) => {
      // Guard against malformed Location headers
      const cleanBase = String(baseUrl || "").replace(/[\r\n]/g, "").trim();
      const cleanUrl = String(url || "").replace(/[\r\n]/g, "").trim();
      if (cleanUrl.startsWith("/")) return `${cleanBase}${cleanUrl}`;
      if (cleanUrl.startsWith(cleanBase)) return cleanUrl;
      return cleanBase;
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
