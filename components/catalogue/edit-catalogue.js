import { Fragment, useContext, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { baseUrl } from "../../client/config";
import NotificationContext from "../../store/notification-context";
import Router from "next/router";
import useSWR from "swr";
import { UserContext } from "../../store/user-context";
import { XIcon } from "@heroicons/react/solid";

const EditCatalogue = ({ catalogue }) => {
  // const fetcher = (...args) => fetch(...args).then((res) => res.json());
  // const { data: user } = useSWR(baseUrl + `/user-list/users`, fetcher);

  const { user } = useContext(UserContext);

  if (user && user.role !== "ADMIN") {
    Router.push("/");
  }

  const formRef = useRef();
  const [open, setOpen] = useState(true);
  const notificationCtx = useContext(NotificationContext);

  const editCatalogue = async () => {
    setOpen(false);
    const editId = catalogue.id;

    const {
      editTitle,
      editYear,
      editAuthor,
      editPublisher,
      editISBN,
      editShelfNumber,
      editRawNumber,
    } = formRef.current;

    const bookTitle = editTitle.value;
    const bookYear = editYear.value;
    const bookAuthor = editAuthor.value;
    const bookPublisher = editPublisher.value;
    const bookIsbn = editISBN.value;
    const shelfNumber = editShelfNumber.value;
    const rawNumber = editRawNumber.value;
    const body = {
      bookTitle,
      bookYear,
      bookAuthor,
      bookPublisher,
      bookIsbn,
      shelfNumber,
      rawNumber,
    };

    try {
      notificationCtx.showNotification({
        title: "Edit Catalogue",
        message: "Editing Catalogue Status",
        status: "pending",
      });
      fetch(baseUrl + `/catalogue/${editId}`, {
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
            message: "Successfully Edited The Catalogue",
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
                  Edit Catalogue
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
                          defaultValue={catalogue?.bookTitle}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                            defaultValue={catalogue?.bookYear}
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
                            defaultValue={catalogue?.bookAuthor}
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
                            defaultValue={catalogue?.bookPublisher}
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
                            defaultValue={catalogue?.bookIsbn}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="editShelfNumber"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Shelf Number
                        </label>
                        <div className="mt-1">
                          <input
                            name="editShelfNumber"
                            type="number"
                            defaultValue={catalogue?.shelfNumber}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="editRawNumber"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Raw Number
                        </label>
                        <div className="mt-1">
                          <input
                            name="editRawNumber"
                            type="number"
                            defaultValue={catalogue?.rawNumber}
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
                          onClick={() => editCatalogue()}
                        >
                          Save
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

export default EditCatalogue;
