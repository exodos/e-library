import React from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import prisma from "../../utils/prisma";
import Custom404 from "../404";
import { getSession } from "next-auth/react";

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

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/sign-in",
      },
    };
  }

  const { params } = ctx;

  let selectedBook = null;
  try {
    selectedBook = await prisma.Book.findUnique({
      where: {
        id: parseInt(params.bookId),
      },
    });
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
