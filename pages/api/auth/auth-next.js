const ldap = require("ldapjs");
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const url = `ldap://${process.env.LDAP_SERVER}`;

export default (req, res) => {
  NextAuth(req, res, {
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
};
