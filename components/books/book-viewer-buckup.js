import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import workerSrc from "../../pdf-worker";
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

const BookViewer = (props) => {
  const { pdf } = props;

  // const [file, setFile] = useState("./simple.pdf");
  // console.log(file);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const changePage = (offset) => {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  };

  const previousPage = () => {
    changePage(-1);
  };

  const nextPage = () => {
    changePage(1);
  };

  return (
    <main className="flex-1">
      <div className="border-b border-gray-200 px-4 py-2 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex-1 min-w-0">
          <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess}>
            <Page
              pageNumber={pageNumber}
              // scale={1.2}
            />
          </Document>
        </div>
      </div>
      <div className="px-4 mt-2 sm:px-6 lg:px-8">
        <h2 className="text-gray-900 text-xs font-medium uppercase tracking-wide">
          Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
        </h2>
      </div>
      <div className="px-4 mt-6 sm:px-6 lg:px-8">
        <button
          disabled={pageNumber <= 1}
          // className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 disabled:bg-gray-300"
          type="button"
          // disabled={pageNumber <= 1}
          onClick={previousPage}
          className="bg-blue-500 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300"
        >
          Previous
        </button>
        <button
          // className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
          type="button"
          disabled={pageNumber >= numPages}
          onClick={nextPage}
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </main>
  );

  /*
  <main className="flex-1">
      <div className="border-b border-gray-200 px-4 py-2 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex-1 min-w-0">
          <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} scale={1.4} />
          </Document>
        </div>

        <div className="px-4 mt-2 sm:px-6 lg:px-8">
          <h2 className="text-gray-900 text-xs font-medium uppercase tracking-wide">
            Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
          </h2>
        </div>
        <div className="px-4 mt-6 sm:px-6 lg:px-8">
          <button
            disabled={pageNumber <= 1}
            // className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 disabled:bg-gray-300"
            type="button"
            disabled={pageNumber <= 1}
            onClick={previousPage}
            className="bg-blue-500 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300"
          >
            Previous
          </button>
          <button
            // className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
            type="button"
            disabled={pageNumber >= numPages}
            onClick={nextPage}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>
    </main>
    */
};

export default BookViewer;
