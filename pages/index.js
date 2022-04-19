import Head from "next/head";
import { baseUrl } from "../client/config";
import BookList from "../components/books/book-list";
import { getSession } from "next-auth/react";
import { useContext } from "react";
import { UserContext } from "../store/user-context";

const Home = ({ bookData }) => {
  const { user } = useContext(UserContext);
  if (!user) {
    return "Loading";
  }
  const userId = user.oracleId;
  // console.log(userId);
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
    if (searchBook == null) {
      const res = await fetch(baseUrl + `/book/pagination?page=${page}`);
      if (res.status !== 200) {
        throw new Error("Failed To Fetch");
      }
      bookData = await res.json();
    } else {
      const res = await fetch(
        baseUrl + `/book/pagination?page=${page}&search=${searchBook}`
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
