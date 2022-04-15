import { SearchIcon, BellIcon, ChevronDownIcon } from "@heroicons/react/solid";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const SearchBooks = () => {
  // const handlePress = (e) => {
  //   if (e.key === "Enter") {
  //     const inputVal = e.target.value;
  //     console.log(inputVal);
  //   }
  // };
  return (
    <div className="flex-1 flex">
      <form className="w-full flex md:ml-0" action="#" method="GET">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <div className="relative w-full text-gray-400 focus-within:text-gray-600">
          <div
            className="absolute inset-y-0 left-0 flex items-center pointer-events-none"
            aria-hidden="true"
          >
            <SearchIcon className="h-5 w-5" aria-hidden="true" />
          </div>
          <input
            id="search"
            name="search"
            className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-transparent sm:text-sm"
            placeholder="Search E-Books"
            type="search"
            // onKeyDown={handlePress}
          />
        </div>
      </form>
    </div>
  );
};

export default SearchBooks;
