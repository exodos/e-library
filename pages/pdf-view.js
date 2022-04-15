import React from "react";
import dynamic from "next/dynamic";
import { useState } from "react";
import Head from "next/head";
import UserList from "../components/users/user-list";

const BookViewer = dynamic(() => import("../components/books/book-viewer"), {
  ssr: false,
});

const PdfView = () => {
  const [file, setFile] = useState("./books/Rich-Dad-Poor-Dad-eBook.pdf");
  return (
    <div>
      <Head>
        <title>Corporate Library Management System</title>
        <meta
          name="description"
          content="Corporate Library Management System"
        />
      </Head>

      <div className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
          <UserList />
        </div>
      </div>
      <div className="mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* <div className="px-4 sm:px-6 lg:px-8"> */}
          <BookViewer pdf={file} />
        </div>
      </div>
    </div>
  );
};

export default PdfView;
