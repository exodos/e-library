// const ldap = require("ldapjs");
// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import prisma from "../../../utils/prisma";

// const url = `ldap://${process.env.LDAP_SERVER}`;

// export default NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: "LDAP",
//       credentials: {
//         username: { label: "DN", type: "text", placeholder: "" },
//         password: { label: "Password", type: "password" },
//       },
//       authorize: async (credentials, req) => {
//         // You might want to pull this call out so we're not making a new LDAP client on every login attemp
//         const client = ldap.createClient({
//           url: url,
//         });

//         return new Promise((resolve, reject) => {
//           client.bind(
//             `${credentials.username}@${process.env.LDAP_DOMAIN}`,
//             credentials.password,
//             (error) => {
//               if (error) {
//                 console.log(error);
//                 reject("Wrong email or password.");
//               }

//               const filter = `(sAMAccountName=${credentials.username})`;

//               client.search(
//                 process.env.LDAP_BASE_DN,
//                 {
//                   filter,
//                   scope: "sub",
//                   attributes: [
//                     "mail",
//                     "employeeid",
//                     "title",
//                     "name",
//                     "division",
//                     "department",
//                     "section",
//                   ],
//                 },
//                 (err, results) => {
//                   if (err) {
//                     reject(`User ${username} LDAP search error`);
//                   }

//                   const entries = [];

//                   results.on("searchEntry", (entry) => {
//                     entries.push(entry.object);
//                   });

//                   results.on("error", (err) => {
//                     console.log(err);
//                     reject("LDAP SEARCH error");
//                   });

//                   results.on("end", async (result) => {
//                     if (entries.length == 0) {
//                       reject("Something went wrong. Please try again. (AD)");
//                     }

//                     const searchResult = JSON.stringify(entries[0]);
//                     const adEmployee = JSON.parse(searchResult);
//                     const empId = adEmployee?.employeeID;
//                     const fullName = adEmployee.name;
//                     const jobRole = adEmployee?.title;
//                     const [arrayRole] = jobRole.split(" ").slice(-1);
//                     const email = adEmployee?.mail;
//                     const division = adEmployee?.division;
//                     const department = adEmployee?.department;
//                     let user = null;
//                     let role = "USER";
//                     try {
//                       const checkUser = await prisma.User.findUnique({
//                         where: {
//                           oracleId: parseInt(empId),
//                         },
//                       });

//                       if (!checkUser) {
//                         if (
//                           arrayRole === "Officer" ||
//                           arrayRole === "Director"
//                         ) {
//                           role = "CONTRIBUTOR";
//                         }

//                         user = await prisma.User.create({
//                           data: {
//                             oracleId: parseInt(empId),
//                             userName: credentials.username,
//                             fullName: fullName,
//                             jobRole: jobRole,
//                             email: email,
//                             division: division,
//                             department: department,
//                             role: role,
//                           },
//                         });
//                       } else {
//                         user = checkUser;
//                       }
//                       resolve({ user });
//                     } catch (err) {
//                       console.log(err);
//                     }
//                   });
//                 }
//               );
//             }
//           );
//         });
//       },
//     }),
//   ],

//   pages: {
//     signIn: "/auth/sign-in",
//     // signOut: "/auth/sign-in",
//     error: "/auth/sign-in",
//   },
//   callbacks: {
//     // signIn: async ({ user, account, profile, email, credentials }) => {
//     //   const isAllowedToSignIn = true;
//     //   if (isAllowedToSignIn) {
//     //     return true;
//     //   } else {
//     //     return false;
//     //   }
//     // },
//     // redirect: async ({ url, baseUrl }) => {
//     //   return baseUrl;
//     // },
//     jwt: async ({ token, user }) => {
//       const isSignIn = user ? true : false;
//       if (isSignIn) {
//         token.id = user.oracleId;
//         token.username = user.username;
//         token.password = user.password;
//       }
//       return token;
//     },
//     session: async ({ session, token }) => {
//       if (token) {
//         session.id = token.id;
//         session.username = token.username;
//         session.password = token.password;
//       }
//       return session;
//       // return { ...session, user: { username: token.username } };
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   jwt: {
//     secret: process.env.NEXTAUTH_SECRET,
//     encryption: true,
//   },
// });
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
              }
              // else {
              //   console.log("Successfully Logged In");
              //   resolve({
              //     username: credentials.username,
              //     password: credentials.password,
              //   });
              // }
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

                    const searchResult = JSON.stringify(entries[0]);
                    const adEmployee = JSON.parse(searchResult);
                    const empId = adEmployee?.employeeID;
                    const fullName = adEmployee.name;
                    const jobRole = adEmployee?.title;
                    const [arrayRole] = jobRole.split(" ").slice(-1);
                    const email = adEmployee?.mail;
                    const division = adEmployee?.division;
                    const department = adEmployee?.department;
                    let user = null;
                    let role = "USER";
                    try {
                      const checkUser = await prisma.User.findUnique({
                        where: {
                          oracleId: parseInt(empId),
                        },
                      });

                      if (!checkUser) {
                        if (
                          arrayRole === "Officer" ||
                          arrayRole === "Director"
                        ) {
                          role = "CONTRIBUTOR";
                        }

                        user = await prisma.User.create({
                          data: {
                            oracleId: parseInt(empId),
                            userName: credentials.username,
                            fullName: fullName,
                            jobRole: jobRole,
                            email: email,
                            division: division,
                            department: department,
                            role: role,
                          },
                        });
                      } else {
                        user = checkUser;
                      }
                      resolve(user);
                    } catch (err) {
                      console.log(err);
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
    // signOut: "/auth/sign-in",
    error: "/auth/sign-in",
  },
  callbacks: {
    // signIn: async ({ user, account, profile, email, credentials }) => {
    //   const isAllowedToSignIn = true;
    //   if (isAllowedToSignIn) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // },
    // redirect: async ({ url, baseUrl }) => {
    //   return baseUrl;
    // },
    jwt: async ({ token, user }) => {
      const isSignIn = user ? true : false;
      if (isSignIn) {
        token.id = user.oracleId;
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
  session: {
    strategy: "jwt",
    maxAge: 10 * 60,
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
});
