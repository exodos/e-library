import React, { useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { baseUrl } from "../../client/config";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { UserContext } from "../../store/user-context";
import { getSession } from "next-auth/react";

const Publish = ({ bookData }) => {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const [books, setBooks] = useState([]);

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

  if (!user) {
    return "Loading";
  }

  if (user && user.role !== "ADMIN") {
    router.push("/");
  }

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
      <div className="mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg leading-6 font-semibold text-lightGreen">
            Unpublished Books
          </h2>
          <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5 border-2 border-t-indigo-500 py-5">
            {books.length > 0 &&
              books.map((item, i) => (
                <div
                  key={i}
                  className="bg-white overflow-hidden shadow rounded-lg"
                >
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-1">
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                          <Link href={`/publish/${item.id}`}>
                            <a>
                              <Image
                                src={`/book-images/${item.bookThumb}`}
                                width={200}
                                height={300}
                                title={item.bookTitle}
                                alt={item.bookTitle}
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

          {books.length > 0 && (
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

  const { query } = ctx;

  const page = query.page || 1;
  const searchBook = query.search;
  let bookData = null;

  try {
    if (searchBook === undefined) {
      const res = await fetch(baseUrl + `/api/publish/publish?page=${page}`);
      if (res.status !== 200) {
        throw new Error("Failed To Fetch");
      }
      bookData = await res.json();
    } else {
      const res = await fetch(
        baseUrl + `/api/publish/publish?page=${page}&search=${searchBook}`
      );
      if (res.status !== 200) {
        throw new Error("Failed To Fetch");
      }
      bookData = await res.json();
    }
  } catch (err) {
    bookData = { error: { message: err.message } };
  }

  return {
    props: {
      session,
      bookData,
    },
  };
};

export default Publish;
