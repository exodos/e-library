import { SearchCircleIcon } from "@heroicons/react/solid";
import { unstable_getServerSession } from "next-auth";
import Head from "next/head";
import { useContext, useRef } from "react";
import { baseUrl } from "../../client/config";
import ReadBook from "../../components/report/read-book";
import { UserContext } from "../../store/user-context";
import { authOptions } from "/pages/api/auth/[...nextauth]";

const MostReadBooks = ({ visitorList }) => {
  const { user } = useContext(UserContext);

  const formRef = useRef();
  if (!user) {
    return "Loading";
  }

  if (user && user.role !== "ADMIN") {
    Router.push("/");
  }

  const submitSearch = async () => {
    const { dateFrom, dateTo } = formRef.current;
    const from = dateFrom.value;
    const to = dateTo.value;
  };
  return (
    <>
      <Head>
        <title>Corporate Library Management System</title>
        <meta
          name="description"
          content="Corporate Library Management System"
        />
      </Head>
      <div className="mt-8 mx-10">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h2 className="mt-8 text-lg leading-6 font-bold text-lightGreen">
                Most Read Books Report
              </h2>
              <p className="mt-2 text-sm font-semibold text-lightGreen">
                A list of Book based on read frequency
              </p>
            </div>

            <form
              className="mt-3 flex -space-x-2 overflow-hidden"
              ref={formRef}
            >
              <div className="inline-block">
                <div className="sm:grid sm:grid-cols-1 sm:gap-4 sm:items-start  sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="dateFrom"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    From
                  </label>
                </div>
                <div className="max-w-lg flex rounded-md shadow-sm">
                  <input
                    type="date"
                    className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                    id="dateFrom"
                    name="dateFrom"
                  />
                </div>
              </div>
              <div className="inline-block pl-10">
                <div className="sm:grid sm:grid-cols-1 sm:gap-4 sm:items-start  sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="dateTo"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    To
                  </label>
                </div>
                <div className="max-w-lg flex rounded-md shadow-sm">
                  <input
                    className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                    type="date"
                    id="dateTo"
                    name="dateTo"
                  />
                </div>
              </div>
              <div className="inline-block pl-10 pt-7">
                <div className="sm:grid sm:grid-cols-1 sm:gap-4 sm:items-start  sm:border-gray-200 sm:pt-5">
                  <button
                    // onClick={() => submitSearch()}
                    type="submit"
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-lightBlue px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-deepBlue focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                  >
                    <SearchCircleIcon
                      className="flex-shrink-0 mr-1.5 h-5 w-5 text-white"
                      aria-hidden="true"
                    />
                    Search By Date
                  </button>
                </div>
              </div>
            </form>
          </div>
          <ReadBook visitorList={visitorList} />
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

  const page = query.page || 1;
  const searchBook = query.search;

  const dateFrom = query.dateFrom;
  const dateTo = query.dateTo;
  // console.log("date From: ", dateFrom, " date To :", dateTo);
  let visitorList = null;

  try {
    if (searchBook != null) {
      const res = await fetch(
        baseUrl +
          `/user-list/visitor-list/visitors?page=${page}&search=${searchBook}`
      );
      if (res.status !== 200) {
        throw new Error("Failed To Fetch");
      }
      visitorList = await res.json();
    } else if (dateFrom != null && dateTo != null) {
      const res = await fetch(
        baseUrl +
          `/user-list/visitor-list/visitors?page=${page}&dateFrom=${dateFrom}&dateTo=${dateTo}`
      );
      if (res.status !== 200) {
        throw new Error("Failed To Fetch");
      }
      visitorList = await res.json();
    } else {
      const res = await fetch(
        baseUrl + `/user-list/visitor-list/visitors?page=${page}`
      );
      if (res.status !== 200) {
        throw new Error("Failed To Fetch");
      }
      visitorList = await res.json();
    }
  } catch (err) {
    visitorList = { error: { message: err.message } };
  }

  return {
    props: {
      session,
      visitorList,
    },
  };
};

export default MostReadBooks;
