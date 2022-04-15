import { CloudUploadIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";

const ExportVisitors = ({ visitorList }) => {
  const [visitors, setVisitors] = useState([]);

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

  const [visitorHeaders] = useState([
    { label: "Visitor Name", key: "user.fullName" },
    { label: "Oracle Id", key: "user.oracleId" },
    { label: "email", key: "user.email" },
    { label: "Division", key: "user.division" },
    { label: "Department", key: "user.department" },
    { label: "Visted/Downloaded Book", key: "book.bookTitle" },
    { label: "Visited At", key: "visitedAt" },
  ]);

  return (
    <div className="mb-4">
      {visitors?.length && (
        <CSVLink
          headers={visitorHeaders}
          data={visitors}
          filename="result.csv"
          target="_blank"
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-lightBlue px-4 py-3  text-sm font-medium text-white shadow-sm hover:bg-deepBlue focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
        >
          <CloudUploadIcon
            className="flex-shrink-0 mr-1.5 h-5 w-5 text-white"
            aria-hidden="true"
          />
          Export Page Visitors
        </CSVLink>
      )}
    </div>
  );
};

export default ExportVisitors;
