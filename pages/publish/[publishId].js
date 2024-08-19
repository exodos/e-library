import React from "react";
import Head from "next/head";
import Image from "next/image";
import Router from "next/router";
import { useContext, useState } from "react";
import { baseUrl } from "../../client/config";
import DeleteBook from "../../components/books/delete-book";
import NotificationContext from "../../store/notification-context";
import {
  CheckCircleIcon,
  TrashIcon,
  PencilAltIcon,
} from "@heroicons/react/solid";
import EditBook from "../../components/books/edit-book";
import { UserContext } from "../../store/user-context";
import { getSession } from "next-auth/react";

const PublishDetails = (props) => {
  const { user } = useContext(UserContext);
  const [showDeleteBookModal, setShowDeleteBookModal] = useState(false);
  const [showEditBookModal, setShowEditBookModal] = useState(false);
  const publish = props.publishBook;
  const notificationCtx = useContext(NotificationContext);

  if (!user) {
    return "Loading";
  }

  if (!publish) {
    return (
      <section className="text-gray-700 body-font overflow-hidden">
        <div className="container px-5 py-24 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <p className="text-2xl font-semibold text-eRed">Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  const publishBook = async (id) => {
    await fetch(baseUrl + `/api/publish/${id}`, {
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
          message: "Successfully Uploaded E-Books",
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

  return (
    <>
      <Head>
        <title>{publish?.bookTitle}</title>
        <meta name="description" content={publish?.bookCategory} />
      </Head>
      <section className="text-gray-700 body-font overflow-hidden bg-gray-100">
        <div className="container px-5 py-5 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap bg-white">
            {/* <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0"> */}
            <div className="lg:h-auto lg:w-50 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden py-10">
              <Image
                src={`/book-images/${publish?.bookThumb}`}
                alt={publish.bookTitle}
                width={400}
                height={600}
              />
            </div>
            <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
              <h2 className="text-sm title-font text-gray-500 tracking-widest">
                Book Title
              </h2>
              <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                {publish.bookTitle}
              </h1>
              <p className="leading-relaxed">{publish?.bookDescription}</p>
              <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-200 mb-5">
                <div className="flex">
                  <h2 className="text-sm title-font text-gray-500 tracking-widest mr-5">
                    Published Year:
                  </h2>
                  <h1 className="text-gray-900 text-1xl title-font font-medium mb-1">
                    {publish?.bookYear}
                  </h1>
                </div>
                <div className="flex ml-6 items-center">
                  <h2 className="text-sm title-font text-gray-500 tracking-widest mr-5">
                    Author:
                  </h2>
                  <h2 className="text-gray-900 text-1xl title-font font-medium mb-1">
                    {publish?.bookAuthor}
                  </h2>
                </div>
              </div>
              <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-200 mb-5">
                <div className="flex">
                  <h2 className="text-sm title-font text-gray-500 tracking-widest mr-5">
                    Publisher:
                  </h2>
                  <h1 className="text-gray-900 text-1xl title-font font-medium mb-1">
                    {publish?.bookPublisher}
                  </h1>
                </div>
                <div className="flex ml-6 items-center">
                  <h2 className="text-sm title-font text-gray-500 tracking-widest mr-5">
                    ISBN:
                  </h2>
                  <h2 className="text-gray-900 text-1xl title-font font-medium mb-1">
                    {publish?.bookIsbn}
                  </h2>
                </div>
              </div>
              <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-200 mb-5">
                <div className="flex">
                  <h2 className="text-sm title-font text-gray-500 tracking-widest mr-5">
                    Recommended By:
                  </h2>
                  <h1 className="text-gray-900 text-1xl title-font font-medium mb-1">
                    {publish?.bookRecommendedBy}
                  </h1>
                </div>
                <div className="flex ml-6 items-center">
                  <h2 className="text-sm title-font text-gray-500 tracking-widest mr-5">
                    Category:
                  </h2>
                  <h2 className="text-gray-900 text-1xl title-font font-medium mb-1">
                    {publish?.bookCategory}
                  </h2>
                </div>
              </div>
              <div className="flex">
                <button
                  className="flex ml-10 lg:ml-8  text-white bg-lightGreen border-0 py-2 px-6 focus:outline-none hover:bg-deepGreen rounded"
                  onClick={() => publishBook(publish?.id)}
                >
                  <CheckCircleIcon
                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-white"
                    aria-hidden="true"
                  />
                  Publish
                </button>
                <button
                  className="flex ml-10 text-white bg-red-400 border-0 py-2 px-6 focus:outline-none hover:bg-eRed rounded"
                  onClick={() => setShowDeleteBookModal((prev) => !prev)}
                >
                  <TrashIcon
                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-white"
                    aria-hidden="true"
                  />
                  Delete
                </button>
                <button
                  className="flex ml-10 text-white bg-lightBlue border-0 py-2 px-6 focus:outline-none hover:bg-deepBlue rounded"
                  onClick={() => setShowEditBookModal((prev) => !prev)}
                >
                  <PencilAltIcon
                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-white"
                    aria-hidden="true"
                  />
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
        {showDeleteBookModal ? <DeleteBook publish={publish} /> : null}

        {showEditBookModal ? <EditBook publish={props.publishBook} /> : null}
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
  } else if (session?.user?.role === "USER") {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  const { params } = ctx;
  const publishId = parseInt(params.publishId);
  let publish = null;

  try {
    const res = await fetch(
      baseUrl + `/api/publish/fetch-publish/${publishId}`
    );

    if (res.status !== 200) {
      throw new Error("Error fetching books");
    }
    publish = await res.json();
  } catch (err) {
    console.log(err.message);
  }

  return {
    props: {
      session,
      publishBook: publish,
    },
  };
};

export default PublishDetails;
