import { PencilIcon, TrashIcon } from "@heroicons/react/solid";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import ReactPaginate from "react-paginate";
import Link from "next/link";
import DeleteCatalogue from "./delete-catalogue";
import EditCatalogue from "./edit-catalogue";
import useSWR from "swr";
import { baseUrl } from "../../client/config";
import { UserContext } from "../../store/user-context";

const CatalogueList = ({ catalogueData }) => {
  // const fetcher = (...args) => fetch(...args).then((res) => res.json());
  // const { data: user } = useSWR(baseUrl + `/user-list/users`, fetcher);

  const { user } = useContext(UserContext);

  let allowed = false;

  if (!user) {
    return "Loading";
  }
  if (user.role === "ADMIN") {
    allowed = true;
  }
  const [catalogue, setCatalogue] = useState([]);
  const [editList, setEditList] = useState(null);
  const [deleteList, setDeleteList] = useState(null);
  const router = useRouter();
  const [showDeleteCatalogueModal, setShowDeleteCatalogueModal] =
    useState(false);
  const [showEditCatalogueModal, setShowEditCatalogueModal] = useState(false);

  useEffect(() => {
    if (catalogueData) {
      if (catalogueData.error) {
        return (
          <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-5 border-2 border-t-deepBlue pt-5">
            <h1 className="text-red-700">{catalogueData.error}</h1>
          </div>
        );
      } else {
        setCatalogue(catalogueData.catalogue);
      }
    }
  }, [catalogueData]);

  const handlePaginate = (page) => {
    const path = router.pathname;
    const query = router.query;
    query.page = page.selected + 1;
    router.push({
      pathname: path,
      query: query,
    });
  };

  const handleEdit = (myList) => {
    setShowEditCatalogueModal((prev) => !prev);
    setEditList(myList);
  };

  const handleDelete = (delList) => {
    setShowDeleteCatalogueModal((prev) => !prev);
    setDeleteList(delList);
  };

  return (
    <>
      <div>
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr className="divide-x divide-gray-200">
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Number
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Title
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Year
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Author
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Publisher
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        ISBN
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Shelf Number
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pr-6"
                      >
                        Raw Number
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Edit</span>
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Delete</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {catalogue.length > 0 &&
                      catalogue.map((item, i) => (
                        <tr
                          key={i}
                          className="divide-x divide-gray-200 hover:bg-gray-100"
                        >
                          <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-6">
                            {item.id}
                          </td>
                          <td className="whitespace-nowrap p-4 text-sm text-gray-500">
                            {item.bookTitle}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.bookYear}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.bookAuthor}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.bookPublisher}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.bookIsbn}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.shelfNumber}
                          </td>
                          <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                            {item.rawNumber}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            {allowed && (
                              <button
                                onClick={() => handleEdit(item)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                <PencilIcon
                                  className="flex-shrink-0 mr-1.5 h-5 w-5 text-lightBlue"
                                  aria-hidden="true"
                                />
                              </button>
                            )}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            {allowed && (
                              <button
                                onClick={() => handleDelete(item)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                <TrashIcon
                                  className="flex-shrink-0 mr-1.5 h-5 w-5 text-lightBlue"
                                  aria-hidden="true"
                                />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <ReactPaginate
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          initialPage={catalogueData.curPage - 1}
          pageCount={catalogueData.maxPage}
          onPageChange={handlePaginate}
          containerClassName={
            "border-t border-gray-200 px-4 flex items-center justify-between sm:px-0 mt-6"
          }
          subContainerClassName={
            "border-t-2 border-transparent pt-4 pr-2 pl-2 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-black"
          }
          pageClassName={
            "border-transparent text-gray-700 hover:text-gray-900 hover:border-black border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium"
          }
          nextClassName={
            "border-t-2 border-transparent pt-4 pr-3 inline-flex items-center text-sm font-medium text-gray-900 hover:text-gray-700 hover:border-black"
          }
          previousLinkClassName={
            "border-t-2 border-transparent pt-4 pl-3 inline-flex items-center text-sm font-medium text-gray-900 hover:text-gray-700 hover:border-black"
          }
        />
      </div>
      {showDeleteCatalogueModal ? (
        <DeleteCatalogue catalogue={deleteList} />
      ) : null}

      {showEditCatalogueModal ? <EditCatalogue catalogue={editList} /> : null}
    </>
  );
};
export default CatalogueList;
