import { CloudUploadIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";

const ExportReaders = ({ visitorList }) => {
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
    { label: "Book Title", key: "book.bookTitle" },
    { label: "Book Category", key: "book.bookCategory" },
    { label: "Book Year", key: "book.bookYear" },
    { label: "Book Author", key: "book.bookAuthor" },
    { label: "Book Publisher", key: "book.bookPublisher" },
    { label: "Book ISBN", key: "book.bookIsbn" },
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
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-lightGreen px-4 py-3  text-sm font-medium text-white shadow-sm hover:bg-deepGreen focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
        >
          <CloudUploadIcon
            className="flex-shrink-0 mr-1.5 h-5 w-5 text-white"
            aria-hidden="true"
          />
          Export Read Books
        </CSVLink>
      )}
    </div>
  );
};

export default ExportReaders;
