import { getSession, useSession } from "next-auth/react";
import { PlusCircleIcon } from "@heroicons/react/solid";
import { baseUrl } from "../../client/config";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import CatalogueList from "../../components/catalogue/catalogue-list";
import Head from "next/head";
import useSWR from "swr";
import { UserContext } from "../../store/user-context";

const Catalogue = ({ catalogueData }) => {
  // const fetcher = (...args) => fetch(...args).then((res) => res.json());
  // const { data: user } = useSWR(baseUrl + `/user-list/users`, fetcher);
  const { user } = useContext(UserContext);
  if (!user) {
    return "Loading";
  }
  let allowed = false;

  if (user.role === "ADMIN") {
    allowed = true;
  }
  // const { data: session } = useSession();
  // const [userRole, setUserRole] = useState(null);

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
              <h1 className="mt-8 text-xl font-semibold text-gray-900">
                Catalogue
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                A list of all the Book in catalogue.
              </p>
            </div>
            {allowed && (
              <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                <Link href="/catalogue/add-catalogue">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-lightBlue px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-deepBlue focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                  >
                    <PlusCircleIcon
                      className="flex-shrink-0 mr-1.5 h-5 w-5 text-white"
                      aria-hidden="true"
                    />
                    Add Catalogue
                  </button>
                </Link>
              </div>
            )}
          </div>
          <CatalogueList catalogueData={catalogueData} />
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
  const searchCatalogue = query.search;
  let catalogueData = null;

  try {
    if (searchCatalogue == null) {
      const res = await fetch(baseUrl + `/catalogue/pagination?page=${page}`);
      if (res.status !== 200) {
        throw new Error("Failed To Fetch");
      }
      catalogueData = await res.json();
    } else {
      const res = await fetch(
        baseUrl + `/catalogue/pagination?page=${page}&search=${searchCatalogue}`
      );
      if (res.status !== 200) {
        throw new Error("Failed To Fetch");
      }
      catalogueData = await res.json();
    }
  } catch (err) {
    catalogueData = { error: { message: err.message } };
  }

  return {
    props: {
      session,
      catalogueData,
    },
  };
};

export default Catalogue;
