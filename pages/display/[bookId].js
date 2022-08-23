import React from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import prisma from "../../utils/prisma";
import Custom404 from "../404";
import { getSession } from "next-auth/react";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "/pages/api/auth/[...nextauth]";
import { baseUrl } from "../../client/config";

const BookViewer = dynamic(() => import("../../components/books/book-viewer"), {
  ssr: false,
});

const DisplayBook = ({ selectedBook }) => {
  const book = selectedBook;

  if (!book) {
    return <Custom404 />;
  }
  return (
    <div>
      <Head>
        <title>Corporate Library Management System</title>
        <meta
          name="description"
          content="Corporate Library Management System"
        />
      </Head>
      <div className="mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* <div className="px-4 sm:px-6 lg:px-8"> */}
          <BookViewer pdf={`./books/${book.bookUrl}`} />
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async (context) => {
  // const session = await getSession(ctx);
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/sign-in",
      },
    };
  }

  const { params } = context;
  const bookId = params.bookId;

  let selectedBook = null;
  try {
    const res = await fetch(baseUrl + `/display?bookId=${bookId}`);
    if (res.status !== 200) {
      throw new Error("Could not get books with that Id");
    }
    selectedBook = await res.json();
  } catch (err) {
    console.log(err.message);
  }

  return {
    props: {
      session,
      selectedBook,
    },
  };
};

export default DisplayBook;
