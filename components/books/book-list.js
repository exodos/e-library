import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/router";

const BookList = ({ bookData }) => {
  const [books, setBooks] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (bookData) {
      if (bookData.error) {
        return (
          <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-5 border-2 border-t-deepBlue pt-5">
            <h1 className="text-red-700">{bookData.error}</h1>
          </div>
        );
      } else {
        setBooks(bookData.books);
      }
    }
  }, [bookData]);

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
    <>
      <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5 border-2 border-t-deepBlue py-5">
        {books.length > 0 &&
          books.map((book, i) => (
            <div key={i} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-1">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <Link href={`/books/${book.id}`}>
                        <a>
                          <Image
                            src={`/book-images/${book.bookThumb}`}
                            width={200}
                            height={300}
                            title={book.bookTitle}
                            alt={book.bookTitle}
                          />
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
      {books?.length > 0 && (
        <div className="pt-2 pl-3">
          <span className="text-md font-medium text-gray-50 bg-lightBlue">
            {Number(
              Math.round(bookData.totalBooks).toFixed(1)
            ).toLocaleString()}{" "}
            Books
          </span>{" "}
        </div>
      )}
      {books?.length > 0 && (
        <ReactPaginate
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          initialPage={bookData.curPage - 1}
          pageCount={bookData.maxPage}
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
      )}
    </>
  );
};

export default BookList;
