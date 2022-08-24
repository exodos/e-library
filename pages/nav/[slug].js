import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import UserList from "../../components/users/user-list";
import { baseUrl } from "../../client/config";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { getSession } from "next-auth/react";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "/pages/api/auth/[...nextauth]";

const NavMenu = ({ bookData }) => {
  const router = useRouter();
  const slug = router.query.slug;
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
          {books.length > 0 && (
            <h2 className="text-lg leading-6 font-semibold text-lightGreen">
              Books Recommended By {slug}
            </h2>
          )}
          {books.length <= 0 && (
            <div className="mt-8 p-5 justify-center items-center bg-white">
              <h2 className="text-lg leading-6 font-semibold text-eRed">
                Sorry, We Could not Find Books Recommended By {slug}
              </h2>
            </div>
          )}

          {books?.length > 0 && (
            <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5 border-2 border-t-deepBlue py-5">
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
                            <Link href={`/books/${item.id}`}>
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
          )}
          {books?.length > 0 && (
            <div className="pt-2 pl-3">
              <span className="font-medium text-gray-50 bg-lightBlue">
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

  const { query } = context;

  const slug = query.slug;
  const page = query.page || 1;
  let bookData = null;

  try {
    const res = await fetch(
      baseUrl + `/book/nav_pag?slug=${slug}&page=${page}`
    );
    if (res.status !== 200) {
      throw new Error("Failed To Fetch");
    }
    bookData = await res.json();
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

export default NavMenu;
