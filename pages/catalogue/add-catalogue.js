import React from "react";
import Head from "next/head";
import { useContext, useState } from "react";
import Router from "next/router";
import Link from "next/link";
import NotificationContext from "../../store/notification-context";
import { baseUrl } from "../../client/config";
import { UserContext } from "../../store/user-context";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getSession } from "next-auth/react";

const AddCatalogue = () => {
  const { user } = useContext(UserContext);
  const [formValues, setFormValues] = useState(null);
  const notificationCtx = useContext(NotificationContext);

  const initialValues = {
    bookTitle: "",
    bookYear: "",
    bookAuthor: "",
    bookPublisher: "",
    bookIsbn: "",
    shelfNumber: "",
    rawNumber: "",
  };

  const validate = Yup.object().shape({
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

  let allowed = false;

  if (user.role === "ADMIN") {
    allowed = true;
  }

  const onSubmit = async (values) => {
    try {
      notificationCtx.showNotification({
        title: "Add Catalogue",
        message: "Adding Catalogue",
        status: "pending",
      });

      fetch(baseUrl + `/api/catalogue/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
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

      await Router.push("/catalogue");
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return "Loading";
  }
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
              <Formik
                initialValues={formValues || initialValues}
                validationSchema={validate}
                onSubmit={onSubmit}
                enableReinitialize={true}
              >
                <Form className="space-y-6 divide-y divide-gray-200">
                  <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Add Catalogue
                      </h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        This information will be displayed publicly so be
                        careful what you share.
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
                          <Field
                            type="text"
                            className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                            placeholder="Enter Book Title"
                            name="bookTitle"
                          />
                        </div>
                        <div className="text-eRed text-sm italic mt-2">
                          <ErrorMessage name="bookTitle" />
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
                          <Field
                            type="number"
                            className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                            placeholder="Enter Book Title"
                            name="bookYear"
                          />
                        </div>
                        <div className="text-eRed text-sm italic mt-2">
                          <ErrorMessage name="bookYear" />
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
                          <Field
                            type="text"
                            className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                            placeholder="Enter Book Title"
                            name="bookAuthor"
                          />
                        </div>
                        <div className="text-eRed text-sm italic mt-2">
                          <ErrorMessage name="bookAuthor" />
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
                          <Field
                            type="text"
                            className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                            placeholder="Enter Book Title"
                            name="bookPublisher"
                          />
                        </div>
                        <div className="text-eRed text-sm italic mt-2">
                          <ErrorMessage name="bookPublisher" />
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
                          <Field
                            type="text"
                            className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                            placeholder="Enter Book Title"
                            name="bookIsbn"
                          />
                        </div>
                        <div className="text-eRed text-sm italic mt-2">
                          <ErrorMessage name="bookIsbn" />
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
                          <Field
                            type="number"
                            className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                            placeholder="Enter Book Title"
                            name="shelfNumber"
                          />
                        </div>
                        <div className="text-eRed text-sm italic mt-2">
                          <ErrorMessage name="shelfNumber" />
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
                          <Field
                            type="number"
                            className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                            placeholder="Enter Book Title"
                            name="rawNumber"
                          />
                        </div>
                        <div className="text-eRed text-sm italic mt-2">
                          <ErrorMessage name="rawNumber" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-5">
                    <div className="flex justify-center">
                      <Link href="/catalogue" passHref>
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
                </Form>
              </Formik>
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
