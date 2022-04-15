import Image from "next/image";
import Link from "next/link";

const CommercialDetails = (props) => {
  const { items } = props;

  return (
    <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-5 border-2 border-t-indigo-500 py-5">
      {items.map((book) => (
        <div
          key={book.id}
          className="bg-white overflow-hidden shadow rounded-lg"
        >
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <Link href={`/publish/${book.id}`}>
              <a>
                <Image
                  src={`/book-images/${book.bookThumb}`}
                  width={200}
                  height={300}
                  title={book.bookTitle}
                  alt={book.bookTitle}
                />
              </a>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommercialDetails;
