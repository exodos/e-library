import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { UploadIcon } from "@heroicons/react/solid";
import { CheckCircleIcon } from "@heroicons/react/solid";
import Link from "next/link";

const UserList = ({ user }) => {
  const role = user.role;
  let allowed = false;

  if (role === "CONTRIBUTOR" || role === "ADMIN") {
    allowed = true;
  }

  return (
    <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
      <div className="flex-1 min-w-0">
        <div className="flex items-center">
          <div>
            <div className="flex items-center">
              <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                Welcome To CLMS, {user.fullName}
              </h1>
            </div>
          </div>
        </div>
      </div>
      {allowed && (
        <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
          <Link href={"/books/upload"} passHref>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-lightGreen  hover:bg-deepGreen focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            >
              <UploadIcon
                className="flex-shrink-0 mr-1.5 h-5 w-5 text-white"
                aria-hidden="true"
              />
              Upload Book
            </button>
          </Link>
          {/* {status === "authenticated" && session.user.name === "tsegay" && ( */}
          <Link href={"/publish"} passHref>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-lightGreen hover:bg-deepGreen focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            >
              <CheckCircleIcon
                className="flex-shrink-0 mr-1.5 h-5 w-5 text-white"
                aria-hidden="true"
              />
              Publish Book
            </button>
          </Link>
          {/* )} */}
        </div>
      )}
    </div>
  );
};

export default UserList;
