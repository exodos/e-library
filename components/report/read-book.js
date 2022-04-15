import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/router";
import format from "date-fns/format";

const ReadBook = ({ visitorList }) => {
  const [visitors, setVisitors] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (visitorList) {
      if (visitorList.error) {
        return (
          <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-5 border-2 border-t-deepBlue pt-5">
            <h1 className="text-red-700">{visitorList.error}</h1>
          </div>
        );
      } else {
        setVisitors(visitorList.visitors);
      }
    }
  }, [visitorList]);

  // console.log({ readBook });

  const handlePaginate = (page) => {
    const path = router.pathname;
    const query = router.query;
    query.page = page.selected + 1;
    router.push({
      pathname: path,
      query: query,
    });
  };

  return (
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
                      className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Book Title
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Year
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Author
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Publisher
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      ISBN
                    </th>

                    <th
                      scope="col"
                      className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Visited/Downloaded At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {visitors.length > 0 &&
                    visitors.map((item, i) => (
                      <tr
                        key={i}
                        className="divide-x divide-gray-200 hover:bg-gray-100"
                      >
                        <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-6">
                          {item.book.bookTitle}
                        </td>
                        <td className="whitespace-nowrap p-4 text-sm text-gray-500">
                          {item.book.bookCategory}
                        </td>
                        <td className="whitespace-nowrap p-4 text-sm text-gray-500">
                          {item.book.bookYear}
                        </td>
                        <td className="whitespace-nowrap p-4 text-sm text-gray-500">
                          {item.book.bookAuthor}
                        </td>
                        <td className="whitespace-nowrap p-4 text-sm text-gray-500">
                          {item.book.bookPublisher}
                        </td>
                        <td className="whitespace-nowrap p-4 text-sm text-gray-500">
                          {item.book.bookIsbn}
                        </td>
                        <td className="whitespace-nowrap p-4 text-sm text-gray-500">
                          {format(new Date(item.visitedAt), "dd/MM/yyyy")}
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
        initialPage={visitorList.curPage - 1}
        pageCount={visitorList.maxPage}
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
  );
};

export default ReadBook;
