import React from "react";
import "../styles/globals.css";
import Head from "next/head";
import { NotificationContextProvider } from "../store/notification-context";
import Layout from "../components/Layout/layout";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import Hero from "../components/Layout/hero";
import useSWR from "swr";
import { UserContext } from "../store/user-context";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data: user } = useSWR("/api/user-list/users", fetcher);
  const value = { user };

  const router = useRouter();
  if (router.pathname.startsWith("/auth/sign-in")) {
    return (
      <SessionProvider session={session} refetchInterval={5 * 60}>
        <UserContext.Provider value={value}>
          <NotificationContextProvider>
            <Hero>
              <Head>
                <title>Corporate Library Management System</title>
                <meta
                  name="description"
                  content="Corporate Library Management System"
                />
                <meta
                  name="viewport"
                  content="initial-scale=1.0, width=device-width"
                />
              </Head>
              <Component {...pageProps} />
            </Hero>
          </NotificationContextProvider>
        </UserContext.Provider>
      </SessionProvider>
    );
  }
  return (
    <SessionProvider session={session} refetchInterval={5 * 60}>
      <UserContext.Provider value={value}>
        <NotificationContextProvider>
          <Layout>
            <Head>
              <title>Corporate Library Management System</title>
              <meta
                name="description"
                content="Corporate Library Management System"
              />
              <meta
                name="viewport"
                content="initial-scale=1.0, width=device-width"
              />
            </Head>
            <Component {...pageProps} />
          </Layout>
        </NotificationContextProvider>
      </UserContext.Provider>
    </SessionProvider>
  );
}
