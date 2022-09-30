import React, { useContext } from "react";
import Head from "next/head";
import Image from "next/image";
import { Document, Page, pdfjs } from "react-pdf";
import workerSrc from "../../pdf-worker";
import {
  DocumentDownloadIcon,
  ViewGridIcon,
  TrashIcon,
} from "@heroicons/react/solid";
import Custom404 from "../404";
import Link from "next/link";
import { getSession } from "next-auth/react";
import { baseUrl } from "../../client/config";
import { UserContext } from "../../store/user-context";
import NotificationContext from "../../store/notification-context";
import Router from "next/router";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

const BookDetails = ({ selectedBook }) => {
  const { user } = useContext(UserContext);
  const notificationCtx = useContext(NotificationContext);

  // const [pdfFile, setPdfFile] = useState(selectedBook.bookUrl);

  if (!user) {
    return "Loading";
  }
  let allowed = false;

  if (user && user.role === "ADMIN") {
    allowed = true;
  }

  // console.log({ user });

  if (!selectedBook) {
    return <Custom404 />;
  }

  const pdfFile = selectedBook.bookUrl;

  const handleRead = async (book) => {
    const bookId = book;
    const userId = user.oracleId;

    try {
      const found = await fetch(
        baseUrl + `/api/book-read/visitors?book=${bookId}&user=${userId}`
      );

      if (found.status !== 200) {
        const body = {
          bookId,
          userId,
        };

        fetch(baseUrl + `/api/book-read/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
          .then((response) => response.json())
          .then((data) => console.log(data));
      } else {
        console.log({ message: "Already Added" });
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const addVisitor = async (book) => {
    const bookId = book;
    const userId = user.oracleId;

    try {
      const found = await fetch(
        baseUrl + `/api/book-read/visitors?book=${bookId}&user=${userId}`
      );

      if (found.status !== 200) {
        const body = {
          bookId,
          userId,
        };

        fetch(baseUrl + `/api/book-read/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
          .then((response) => response.json())
          .then((data) => console.log(data));
      } else {
        console.log({ message: "Already Added" });
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const downloadFile = () => {
    window.open(pdfFile, "_blank");
  };

  const handleUnPublish = async (id) => {
    await fetch(baseUrl + `/api/book/unpublish/${id}`, {
      method: "PUT",
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        response.json().then((data) => {
          notificationCtx.showNotification({
            title: "Error",
            message: `${data.message} || 'Something Went Wrong'`,
            status: "error",
          });
        });
      })
      .then((data) => {
        notificationCtx.showNotification({
          title: "Success!",
          message: "Successfully Change Vehicle Status",
          status: "success",
        });
      })
      .catch((error) => {
        notificationCtx.showNotification({
          title: "Error!",
          message: error.message || "Something Went Wrong",
          status: "error",
        });
      });
    await Router.push("/");
  };

  // const downloadFile = () => {
  //   fetch(pdfFile, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/pdf",
  //     },
  //   })
  //     .then((response) => response.blob())
  //     .then((blob) => {
  //       const url = window.URL.createObjectURL(new Blob([blob]));
  //       const link = document.createElement("a");
  //       link.href = url;
  //       link.setAttribute("download", `${selectedBook.bookTitle}`);
  //       document.body.appendChild(link);
  //       link.click();

  //       link.parentNode.removeChild(link);
  //     });
  // };

  return (
    <>
      <Head>
        <title>{selectedBook.bookTitle}</title>
        <meta name="description" content={selectedBook.bookCategory} />
      </Head>
      <section className="text-gray-700 body-font overflow-hidden bg-gray-100">
        <div className="container px-5 py-5 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap bg-white">
            {/* <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0"> */}
            <div className="lg:h-auto lg:w-50 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden py-10 ml-10">
              <Image
                src={`/book-images/${selectedBook.bookThumb}`}
                alt={selectedBook.bookTitle}
                width={400}
                height={600}
              />
            </div>
            <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
              <h2 className="text-sm title-font text-gray-500 tracking-widest">
                Book Title
              </h2>
              <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                {selectedBook.bookTitle}
              </h1>
              <div className="flex mb-4">
                <span className="flex items-center">
                  <svg
                    fill="currentColor"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-4 h-4 text-red-500"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                  <svg
                    fill="currentColor"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-4 h-4 text-red-500"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                  <svg
                    fill="currentColor"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-4 h-4 text-red-500"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                  <svg
                    fill="currentColor"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-4 h-4 text-red-500"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-4 h-4 text-red-500"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                </span>
              </div>
              <p className="leading-relaxed">{selectedBook.bookDescription}</p>
              <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-200 mb-5">
                <div className="flex">
                  <h2 className="text-sm title-font text-gray-500 tracking-widest mr-5">
                    Published Year:
                  </h2>
                  <h1 className="text-gray-900 text-1xl title-font font-medium mb-1">
                    {selectedBook.bookYear}
                  </h1>
                </div>
                <div className="flex ml-6 items-center">
                  <h2 className="text-sm title-font text-gray-500 tracking-widest mr-5">
                    Author:
                  </h2>
                  <h2 className="text-gray-900 text-1xl title-font font-medium mb-1">
                    {selectedBook.bookAuthor}
                  </h2>
                </div>
              </div>
              <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-200 mb-5">
                <div className="flex">
                  <h2 className="text-sm title-font text-gray-500 tracking-widest mr-5">
                    Publisher:
                  </h2>
                  <h1 className="text-gray-900 text-1xl title-font font-medium mb-1">
                    {selectedBook.bookPublisher}
                  </h1>
                </div>
                <div className="flex ml-6 items-center">
                  <h2 className="text-sm title-font text-gray-500 tracking-widest mr-5">
                    ISBN:
                  </h2>
                  <h2 className="text-gray-900 text-1xl title-font font-medium mb-1">
                    {selectedBook.bookIsbn}
                  </h2>
                </div>
              </div>
              <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-200 mb-5">
                <div className="flex">
                  <h2 className="text-sm title-font text-gray-500 tracking-widest mr-5">
                    Recommended By:
                  </h2>
                  <h1 className="text-gray-900 text-1xl title-font font-medium mb-1">
                    {selectedBook.bookRecommendedBy}
                  </h1>
                </div>
                <div className="flex ml-6 items-center">
                  <h2 className="text-sm title-font text-gray-500 tracking-widest mr-5">
                    Category:
                  </h2>
                  <h2 className="text-gray-900 text-1xl title-font font-medium mb-1">
                    {selectedBook.bookategory}
                  </h2>
                </div>
              </div>

              <div className="flex">
                <button
                  className="flex ml-8  text-white bg-lightGreen border-0 py-2 px-3 focus:outline-none hover:bg-deepGreen rounded"
                  // onClick={downloadFile}
                  onClick={() => {
                    downloadFile();
                    addVisitor(selectedBook.id);
                  }}
                >
                  <DocumentDownloadIcon
                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-white"
                    aria-hidden="true"
                  />
                  Download
                </button>
                <Link href={`/${selectedBook.id}`} passHref>
                  <button
                    className="flex ml-8 text-white bg-lightBlue border-0 py-2 px-5 focus:outline-none hover:bg-deepBlue rounded"
                    onClick={() => handleRead(selectedBook.id)}
                  >
                    <ViewGridIcon
                      className="flex-shrink-0 mr-1.5 h-5 w-5 text-white"
                      aria-hidden="true"
                    />
                    Read
                  </button>
                </Link>

                {allowed && (
                  <button
                    className="flex ml-8 text-white bg-lightBlue border-0 py-2 px-3 focus:outline-none hover:bg-deepBlue rounded"
                    onClick={() => handleUnPublish(selectedBook.id)}
                  >
                    <TrashIcon
                      className="flex-shrink-0 mr-1.5 h-5 w-5 text-white"
                      aria-hidden="true"
                    />
                    unpublish
                  </button>
                )}
                <button className="rounded-full w-10 h-10 bg-eRed p-0 border-0 inline-flex items-center justify-center text-white ml-10">
                  <svg
                    fill="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
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
  const bookId = parseInt(params.bookId);

  let selectedBook = null;
  try {
    const res = await fetch(baseUrl + `/api/book/fetch-book/${bookId}`);
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

export default BookDetails;
