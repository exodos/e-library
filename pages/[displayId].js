import React from "react";
import dynamic from "next/dynamic";
import { useState } from "react";
import Head from "next/head";
import Custom404 from "./404";
import { getSession } from "next-auth/react";
import { baseUrl } from "../client/config";

const BookViewer = dynamic(() => import("../components/books/book-viewer"), {
  ssr: false,
});

const BookPdfDisplay = ({ selectedBook }) => {
  // if (!selectedBook) {
  //   return <Custom404 />;
  // }

  // console.log({ session });

  const book = selectedBook;

  const [file, setFile] = useState(`./books/${book.bookUrl}`);

  return (
    <div>
      <Head>
        <title>Corporate Library Management System</title>
        <meta
          name="description"
          content="Corporate Library Management System"
        />
      </Head>
      <div className="mt-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* <div className="px-4 sm:px-6 lg:px-8"> */}
          <BookViewer pdf={file} />
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
  const displayId = parseInt(params.displayId);

  try {
    const res = await fetch(baseUrl + `/display/display-pdf/${displayId}`);
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

export default BookPdfDisplay;
