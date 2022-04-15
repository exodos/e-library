import { Fragment, useContext, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { baseUrl } from "../../client/config";
import { ExclamationIcon, XIcon } from "@heroicons/react/outline";
import NotificationContext from "../../store/notification-context";
import Router from "next/router";

const EditBook = ({ publish }) => {
  const formRef = useRef();
  const [open, setOpen] = useState(true);
  const notificationCtx = useContext(NotificationContext);

  const editPublish = async () => {
    setOpen(false);
    const savePublish = publish.id;

    const {
      editTitle,
      editDescription,
      editYear,
      editAuthor,
      editPublisher,
      editISBN,
      editRecommendedBy,
      editCategory,
    } = formRef.current;

    const bookTitle = editTitle.value;
    const bookDescription = editDescription.value;
    const bookYear = editYear.value;
    const bookAuthor = editAuthor.value;
    const bookPublisher = editPublisher.value;
    const bookIsbn = editISBN.value;
    const bookRecommendedBy = editRecommendedBy.value;
    const bookCategory = editCategory.value;
    const body = {
      bookTitle,
      bookDescription,
      bookYear,
      bookAuthor,
      bookPublisher,
      bookIsbn,
      bookRecommendedBy,
      bookCategory,
    };
    try {
      notificationCtx.showNotification({
        title: "Edit Book",
        message: "Editing Book Status",
        status: "pending",
      });
      fetch(baseUrl + `/edit-save/${savePublish}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
        .then((response) => {
          if (!response.ok) {
            notificationCtx.showNotification({
              title: "Error",
              message: `${data.message} || 'Something Went Wrong'`,
              status: "error",
            });
          } else {
            return response.json();
          }
        })
        .then((data) => {
          notificationCtx.showNotification({
            title: "Success!",
            message: "Successfully Edited The E-Books",
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
    } catch (error) {
      console.error(error);
    }
  };

  const editBook = async () => {
    setOpen(false);
    const editId = publish.id;

    const {
      editTitle,
      editDescription,
      editYear,
      editAuthor,
      editPublisher,
      editISBN,
      editRecommendedBy,
      editCategory,
    } = formRef.current;

    const bookTitle = editTitle.value;
    const bookDescription = editDescription.value;
    const bookYear = editYear.value;
    const bookAuthor = editAuthor.value;
    const bookPublisher = editPublisher.value;
    const bookIsbn = editISBN.value;
    const bookRecommendedBy = editRecommendedBy.value;
    const bookCategory = editCategory.value;
    const body = {
      bookTitle,
      bookDescription,
      bookYear,
      bookAuthor,
      bookPublisher,
      bookIsbn,
      bookRecommendedBy,
      bookCategory,
    };
    try {
      notificationCtx.showNotification({
        title: "Edit Book",
        message: "Editing Book Status",
        status: "pending",
      });
      fetch(baseUrl + `/book/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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
            message: "Successfully Edited The E-Books",
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
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={setOpen}
      >
        <div className="flex items-end justify-center min-h- pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => setOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  <XIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                  Edit Book And Publish
                </h2>
              </div>
              <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                  <form className="space-y-6" ref={formRef}>
                    <div>
                      <label
                        htmlFor="editTitle"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Title
                      </label>
                      <div className="mt-1">
                        <input
                          name="editTitle"
                          type="text"
                          defaultValue={publish?.bookTitle}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="editDescription"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Description
                      </label>
                      <div className="mt-1">
                        <textarea
                          rows={3}
                          className="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                          name="editDescription"
                          defaultValue={publish?.bookDescription}
                          type="text"
                        />
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-1 lg:grid-cols-2">
                      <div>
                        <label
                          htmlFor="editYear"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Year
                        </label>
                        <div className="mt-1">
                          <input
                            name="editYear"
                            type="number"
                            defaultValue={publish?.bookYear}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="editAuthor"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Author
                        </label>
                        <div className="mt-1">
                          <input
                            name="editAuthor"
                            type="text"
                            defaultValue={publish?.bookAuthor}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="editPublisher"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Publisher
                        </label>
                        <div className="mt-1">
                          <input
                            name="editPublisher"
                            type="text"
                            defaultValue={publish?.bookPublisher}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="editISBN"
                          className="block text-sm font-medium text-gray-700"
                        >
                          ISBN
                        </label>
                        <div className="mt-1">
                          <input
                            name="editISBN"
                            type="text"
                            defaultValue={publish?.bookIsbn}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="editRecommendedBy"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Recommended By
                        </label>
                        <div className="mt-1">
                          <select
                            className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                            name="editRecommendedBy"
                            defaultValue={publish?.bookRecommendedBy}
                          >
                            <option>Customer Service</option>
                            <option>Marketing</option>
                            <option>Sales</option>
                            <option>
                              Customer Experience & Quality Management
                            </option>
                            <option>Strategic Program Management</option>
                            <option>HR</option>
                            <option>Telecom Excellence Academy</option>
                            <option>Finance</option>
                            <option>Supply Chain</option>
                            <option>Facilities & Fleet</option>
                            <option>Internal Audit</option>
                            <option>Legal</option>
                            <option>Physical Security</option>
                            <option>Communication</option>
                            <option>Ethics & Anticorruption</option>
                            <option>Zone & Regional Coordination</option>
                            <option>Information Systems</option>
                            <option>Information Security</option>
                            <option>Wireless Network</option>
                            <option>Network Infrastructure</option>
                            <option>
                              Network Operation Service Management
                            </option>
                            <option>Fixed Network</option>
                            <option>CTO</option>
                            <option>Leadership & Management</option>
                            <option>Transversal </option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="editCategory"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Category
                        </label>
                        <div className="mt-1">
                          <input
                            name="editCategory"
                            type="text"
                            defaultValue={publish?.bookCategory}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <button
                          type="button"
                          className="mt-4 mx-4 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-lightGreen text-base font-medium text-white hover:bg-deepGreen focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                          open={open}
                          // onClick={() => editBook(publish.id)}
                          onClick={() => editBook()}
                        >
                          Save
                        </button>
                      </div>
                      <div className="flex items-center">
                        <button
                          type="button"
                          className="mt-4 mx-4 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-lightBlue text-base font-medium text-white hover:bg-deepBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                          open={open}
                          // onClick={() => editBook(publish.id)}
                          onClick={() => editPublish()}
                        >
                          Save &amp; Publish
                        </button>
                      </div>
                      <div className="flex items-center">
                        <button
                          type="button"
                          className="mt-4 mx-4 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                          onClick={() => setOpen(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default EditBook;
