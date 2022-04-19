import React from "react";
import Head from "next/head";
import { useContext, useState } from "react";
import Router from "next/router";
import Link from "next/link";
import NotificationContext from "../../store/notification-context";
import { baseUrl } from "../../client/config";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { getSession } from "next-auth/react";
import useSWR from "swr";
import { UserContext } from "../../store/user-context";

const AddCatalogue = () => {
  // const fetcher = (...args) => fetch(...args).then((res) => res.json());
  // const { data: user } = useSWR(baseUrl + `/user-list/users`, fetcher);
  const { user } = useContext(UserContext);
  if (!user) {
    return "Loading";
  }
  let allowed = false;

  if (!user) {
    return "Loading";
  }
  if (user.role === "ADMIN") {
    allowed = true;
  }
  const [query, setQuery] = useState({
    bookTitle: "",
    bookYear: "",
    bookAuthor: "",
    bookPublisher: "",
    bookIsbn: "",
    shelfNumber: "",
    rawNumber: "",
  });

  const validationSchema = Yup.object().shape({
    bookTitle: Yup.string().required("Book Title Is Required"),
    bookYear: Yup.number()
      .required("Book Year Is Required")
      .typeError("You Must Specify A Number"),
    bookAuthor: Yup.string().required("Book Author Is Required"),
    bookPublisher: Yup.string().required("Book Publisher Is Required"),
    bookIsbn: Yup.string().required("Book ISBN Is Required"),
    shelfNumber: Yup.number()
      .required("Shelf Number Is Required")
      .typeError("You Must Specify A Number"),
    rawNumber: Yup.number()
      .required("Raw Number Is Required")
      .typeError("You Must Specify A Number"),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  const notificationCtx = useContext(NotificationContext);

  const handleChange = () => (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setQuery((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onSubmit = (data) => {
    try {
      notificationCtx.showNotification({
        title: "Add Catalogue",
        message: "Adding Catalogue",
        status: "pending",
      });

      fetch(baseUrl + `/catalogue/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(query),
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
            message: "Successfully Added Catalogues",
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
      Router.push("/catalogue");
    } catch (err) {
      console.error(err);
      notificationCtx.showNotification({
        title: "Error!",
        message: err.message || "Something Went Wrong",
        status: "error",
      });
    }
  };
  return (
    <>
      <Head>
        <title>Add Catalogue</title>
        <meta
          name="description"
          content="Corporate Library Management System Add Catalogue"
        />
      </Head>

      <div className="mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-gray-900 body-font overflow-hidden bg-white">
            <div className="container px-5 py-24 mx-auto">
              <form
                className="space-y-8 divide-y divide-gray-200"
                // acceptCharset="UTF-8"
                // method="POST"
                // encType="multipart/form-data"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Add Catalogue
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      This information will be displayed publicly so be careful
                      what you share.
                    </p>
                  </div>
                </div>
                <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="bookTitle"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Book Title
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="max-w-lg flex rounded-md shadow-sm">
                        <input
                          {...register("bookTitle")}
                          type="text"
                          className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                          id="bookTitle"
                          placeholder="Enter Book Title"
                          name="bookTitle"
                          value={query.bookTitle}
                          onChange={handleChange()}
                        />
                      </div>
                      <div className="text-eRed text-sm italic mt-2">
                        {errors.bookTitle && (
                          <span>{errors.bookTitle.message}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="bookYear"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Book Year
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="max-w-lg flex rounded-md shadow-sm">
                        <input
                          {...register("bookYear")}
                          type="number"
                          className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                          id="bookYear"
                          placeholder="Enter Book Title"
                          name="bookYear"
                          value={query.bookYear}
                          onChange={handleChange()}
                        />
                      </div>
                      <div className="text-eRed text-sm italic mt-2">
                        {errors.bookYear && (
                          <span>{errors.bookYear.message}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="bookAuthor"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Book Author
                    </label>

                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="max-w-lg flex rounded-md shadow-sm">
                        <input
                          {...register("bookAuthor")}
                          type="text"
                          className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                          id="bookAuthor"
                          placeholder="Enter Book Title"
                          name="bookAuthor"
                          value={query.bookAuthor}
                          onChange={handleChange()}
                        />
                      </div>
                      <div className="text-eRed text-sm italic mt-2">
                        {errors.bookAuthor && (
                          <span>{errors.bookAuthor.message}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="bookPublisher"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Book Publisher
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="max-w-lg flex rounded-md shadow-sm">
                        <input
                          {...register("bookPublisher")}
                          type="text"
                          className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                          id="bookPublisher"
                          placeholder="Enter Book Title"
                          name="bookPublisher"
                          value={query.bookPublisher}
                          onChange={handleChange()}
                        />
                      </div>
                      <div className="text-eRed text-sm italic mt-2">
                        {errors.bookPublisher && (
                          <span>{errors.bookPublisher.message}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="bookIsbn"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Book ISBN
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="max-w-lg flex rounded-md shadow-sm">
                        <input
                          {...register("bookIsbn")}
                          type="text"
                          className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                          id="bookIsbn"
                          placeholder="Enter Book Title"
                          name="bookIsbn"
                          value={query.bookIsbn}
                          onChange={handleChange()}
                        />
                      </div>
                      <div className="text-eRed text-sm italic mt-2">
                        {errors.bookIsbn && (
                          <span>{errors.bookIsbn.message}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="shelfNumber"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Shelf Number
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="max-w-lg flex rounded-md shadow-sm">
                        <input
                          {...register("shelfNumber")}
                          type="number"
                          className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                          id="shelfNumber"
                          placeholder="Enter Book Title"
                          name="shelfNumber"
                          value={query.shelfNumber}
                          onChange={handleChange()}
                        />
                      </div>
                      <div className="text-eRed text-sm italic mt-2">
                        {errors.shelfNumber && (
                          <span>{errors.shelfNumber.message}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="rawNumber"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Raw Number
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="max-w-lg flex rounded-md shadow-sm">
                        <input
                          {...register("rawNumber")}
                          type="number"
                          className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                          id="rawNumber"
                          placeholder="Enter Book Title"
                          name="rawNumber"
                          value={query.rawNumber}
                          onChange={handleChange()}
                        />
                      </div>
                      <div className="text-eRed text-sm italic mt-2">
                        {errors.rawNumber && (
                          <span>{errors.rawNumber.message}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-5">
                  <div className="flex justify-center">
                    <Link href="/catalogue">
                      <button
                        type="button"
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancel
                      </button>
                    </Link>
                    <button
                      type="submit"
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-deepGreen hover:bg-lightGreen focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
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

  return {
    props: {
      session: session,
    },
  };
};

export default AddCatalogue;
