import Head from "next/head";
import { baseUrl } from "../client/config";
import BookList from "../components/books/book-list";
import { useContext } from "react";
import { UserContext } from "../store/user-context";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "/pages/api/auth/[...nextauth]";

const Home = ({ bookData }) => {
  const { user } = useContext(UserContext);

  if (!user) {
    return "Loading";
  }
  // const userId = user.oracleId;
  return (
    <>
      <Head>
        <title>Corporate Library Management System</title>
        <meta
          name="description"
          content="Corporate Library Management System"
        />
      </Head>
      <div className="mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg leading-6 font-semibold text-lightGreen">
            Most Recent
          </h2>
          <BookList bookData={bookData} />
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
  let bookData = null;

  try {
    if (searchBook == null) {
      const res = await fetch(baseUrl + `/api/book/pagination?page=${page}`);
      if (res.status !== 200) {
        throw new Error("Failed To Fetch");
      }
      bookData = await res.json();
    } else {
      const res = await fetch(
        baseUrl + `/api/book/pagination?page=${page}&search=${searchBook}`
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
export default Home;
