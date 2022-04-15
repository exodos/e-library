import { CloudUploadIcon, SearchCircleIcon } from "@heroicons/react/solid";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { useContext, useEffect, useRef, useState } from "react";
import { CSVLink } from "react-csv";
import useSWR from "swr";
import { baseUrl } from "../../client/config";
import ExportReaders from "../../components/report/export-readers";
import ExportVisitors from "../../components/report/export-visitors";
import { UserContext } from "../../store/user-context";

const ReportExport = ({ visitorList }) => {
  // const fetcher = (...args) => fetch(...args).then((res) => res.json());
  // const { data: user } = useSWR(baseUrl + `/user-list/users`, fetcher);
  const user = useContext(UserContext);
  if (!user) {
    return "Loading";
  }

  if (user && user.role !== "ADMIN") {
    Router.push("/");
  }

  return (
    <>
      <Head>
        <title>Corporate Library Management System</title>
        <meta name="description" content="Export page visitors report" />
      </Head>
      <div className="mt-8">
        <div className="max-w-6xl mx-auto  sm:px-6 lg:px-8 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-lg leading-6 font-semibold text-lightGreen">
            Export Page Visitor Or Most Read Books
          </h2>

          <div className="inline-block mt-4 mx-20">
            <div className="sm:grid sm:grid-cols-2 sm:gap-4 sm:items-start  sm:border-gray-200 sm:pt-5">
              <div className="inline-block pl-10 pt-7">
                <ExportReaders visitorList={visitorList} />
              </div>
              <div className="inline-block pl-10 pt-7">
                <ExportVisitors visitorList={visitorList} />
              </div>
            </div>
          </div>
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

  let visitorList = null;

  try {
    const res = await fetch(baseUrl + `/report/get-visitors`);
    if (res.status !== 200) {
      throw new Error("Failed To Fetch");
    }
    visitorList = await res.json();
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

export default ReportExport;
