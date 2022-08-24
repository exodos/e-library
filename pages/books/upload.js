import React from "react";
import Head from "next/head";
import { useContext, useState } from "react";
import Router, { useRouter } from "next/router";
import { createBook } from "../../client/request";
import Link from "next/link";
import NotificationContext from "../../store/notification-context";
import { baseUrl } from "../../client/config";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { getSession } from "next-auth/react";
import useSWR from "swr";
import { UserContext } from "../../store/user-context";
import { authOptions } from "/pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";

const UploadBooks = () => {
  const { user } = useContext(UserContext);
  const router = useRouter();

  const [query, setQuery] = useState({
    bookTitle: "",
    bookDescription: "",
    bookYear: "",
    bookAuthor: "",
    bookPublisher: "",
    bookIsbn: "",
    bookRecommendedBy: "",
    bookCategory: "",
    file: "",
  });

  const validationSchema = Yup.object().shape({
    bookTitle: Yup.string().required("Book Title Is Required"),
    bookDescription: Yup.string().required("Book Description Is Required"),
    bookYear: Yup.number()
      .required("Book Year Is Required")
      .typeError("You Must Specify A Number"),
    bookAuthor: Yup.string().required("Book Author Is Required"),
    bookPublisher: Yup.string().required("Book Publisher Is Required"),
    bookIsbn: Yup.string().required("Book ISBN Is Required"),
    bookRecommendedBy: Yup.string().required("Book Recommended By Is Required"),
    bookCategory: Yup.string().required("Book Category Is Required"),
    file: Yup.mixed()
      .required("You Need To Provide File")
      .test("required", "File To Upload Is Required", (value) => {
        return value && value.length;
      }),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  const recommendedOptions = [
    { value: "Customer Service", label: "Customer Service" },
    { value: "Marketing", label: "Marketing" },
    { value: "Sales", label: "Sales" },
    {
      value: "Customer Experience And Quality Management",
      label: "Customer Experience & Quality Management",
    },
    {
      value: "Strategic Program Management",
      label: "Strategic Program Management",
    },
    { value: "HR", label: "HR" },
    {
      value: "Telecom Excellence Academy",
      label: "Telecom Excellence Academy",
    },
    { value: "Finance", label: "Finance" },
    { value: "Supply And Chain", label: "Supply & Chain" },
    { value: "Facilities And Fleet", label: "Facilities & Fleet" },
    { value: "Internal Audit", label: "Internal Audit" },
    { value: "Legal", label: "Legal" },
    { value: "Physical Security", label: "Physical Security" },
    { value: "Communication", label: "Communication" },
    { value: "Ethics And Anticorruption", label: "Ethics & Anticorruption" },
    {
      value: "Zone Or Regional Coordination",
      label: "Zone/Regional Coordination",
    },
    { value: "Information Systems", label: "Information Systems" },
    { value: "Information Security", label: "Information Security" },
    { value: "Wireless Network", label: "Wireless Network" },
    { value: "Network Infrastructure", label: "Network Infrastructure" },
    {
      value: "Network Operation Service Management",
      label: "Network Operation Service Management",
    },
    { value: "Fixed Network", label: "Fixed Network" },
    { value: "CTO", label: "CTO" },
    { value: "Leadership And Management", label: "Leadership & Management" },
    { value: "Transversal", label: "Transversal" },
  ];

  const notificationCtx = useContext(NotificationContext);

  if (!user) {
    return "Loading";
  }

  if (user && user.role === "USER") {
    router.push("/");
  }

  const handleFileChange = () => (e) => {
    setQuery((prevState) => ({
      ...prevState,
      file: e.target.files[0],
    }));
  };

  const handleChange = () => (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setQuery((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onSubmit = async (data) => {
    try {
      notificationCtx.showNotification({
        title: "Upload Book",
        message: "Uploading PDF",
        status: "pending",
      });

      const formData = new FormData();
      Object.entries(query).forEach(([key, value]) => {
        formData.append(key, value);
      });

      await fetch(baseUrl + `/book/create`, {
        method: "POST",
        body: formData,
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
            message: error.message,
            status: "error",
          });
        });
      await Router.push("/");
    } catch (err) {
      console.error(err);
      notificationCtx.showNotification({
        title: "Error!",
        message: err.message,
        status: "error",
      });
    }
  };

  return (
    <>
      <Head>
        <title>Upload Books</title>
        <meta
          name="description"
          content="Corporate Library Management System Upload E-Books"
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
                encType="multipart/form-data"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                  <div>
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Upload E-Books
                      </h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        This information will be displayed publicly so be
                        careful what you share.
                      </p>
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
                      <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                        <label
                          htmlFor="bookDescription"
                          className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                        >
                          Book Description
                        </label>
                        <div className="mt-1 sm:mt-0 sm:col-span-2">
                          <textarea
                            {...register("bookDescription")}
                            rows={3}
                            className="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                            id="bookDescription"
                            placeholder="Enter Book Description"
                            name="bookDescription"
                            // defaultValue={query.book_description}
                            onChange={handleChange()}
                          />
                          <p className="mt-2 text-sm text-lightGreen">
                            Write a few sentences to describe the book.
                          </p>
                          <div className="text-eRed text-sm italic mt-2">
                            {errors.bookDescription && (
                              <span>{errors.bookDescription.message}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                        <label
                          htmlFor="bookYear"
                          className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                        >
                          Published Year
                        </label>

                        <div className="mt-1 sm:mt-0 sm:col-span-2">
                          <div className="max-w-lg flex rounded-md shadow-sm">
                            <input
                              {...register("bookYear")}
                              type="number"
                              className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                              id="bookYear"
                              placeholder="Enter publisher year in format of yyyy"
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
                              placeholder="Enter Book Author"
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
                              placeholder="Enter Book Publisher"
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
                              placeholder="Enter Book ISBN"
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
                      <div className="pt-8 space-y-6 sm:pt-10 sm:space-y-5">
                        <div className="space-y-6 sm:space-y-5">
                          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label
                              htmlFor="bookRecommendedBy"
                              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                            >
                              Recommended By
                            </label>
                            <div className="mt-1 sm:mt-0 sm:col-span-2">
                              <select
                                {...register("bookRecommendedBy")}
                                className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                                value={query.bookRecommendedBy}
                                onChange={handleChange()}
                                id="bookRecommendedBy"
                                name="bookRecommendedBy"
                                // autoComplete={query.book_recommended_by}
                              >
                                <option disabled value="">
                                  Select Recommended By
                                </option>
                                {recommendedOptions.map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                              <div className="text-eRed text-sm italic mt-2">
                                {errors.bookRecommendedBy && (
                                  <span>
                                    {errors.bookRecommendedBy.message}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="bookCategory"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Category
                      </label>
                      <div className="mt-1 sm:mt-0 sm:col-span-2">
                        <div className="max-w-lg flex rounded-md shadow-sm">
                          <input
                            {...register("bookCategory")}
                            type="text"
                            className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                            id="bookCategory"
                            placeholder="Enter Book Category"
                            name="bookCategory"
                            value={query.bookCategory}
                            onChange={handleChange()}
                          />
                        </div>
                        <div className="text-eRed text-sm italic mt-2">
                          {errors.bookCategory && (
                            <span>{errors.bookCategory.message}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="cover_photo"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Pdf Book
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <div className="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-deepGreen hover:text-lightGreen focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-lightGreen"
                          >
                            <span>Upload a file</span>
                            <input
                              {...register("file")}
                              id="file"
                              name="file"
                              type="file"
                              accept=".pdf"
                              className="sr-only"
                              onChange={handleFileChange()}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PDF Only</p>
                      </div>
                    </div>
                    <div className="flex text-eRed text-sm italic mt-2">
                      {errors.file && <span>{errors.file.message}</span>}
                    </div>
                  </div>
                </div>

                <div className="pt-5">
                  <div className="flex justify-center">
                    <Link href="/" passHref>
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
                      Upload
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

  return {
    props: {
      session,
    },
  };
};

export default UploadBooks;
