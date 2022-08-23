import React from "react";
import Image from "next/image";
import Link from "next/link";
import notFoundPage from "../public/image/404.png";

const Custom404 = () => {
  return (
    <>
      <div className="mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
          <div className="flex items-center justify-center">
            <div className="px-4 lg:py-12">
              <div className="lg:gap-4 lg:flex">
                <div className="flex flex-col items-center justify-center md:py-24 lg:py-32">
                  <h1 className="font-bold text-texaRed text-9xl">404</h1>
                  <p className="mb-2 text-2xl font-bold text-center text-gray-800 md:text-3xl">
                    <span className="text-texaRed">Oops!</span> Page not found
                  </p>
                  <p className="mb-8 text-center text-gray-500 md:text-lg">
                    The page you’re looking for doesn’t exist.
                  </p>
                  <Link href="/" passHref>
                    <button className="px-6 py-2 text-sm font-semibold text-white bg-texaBlue hover:bg-lightBlue">
                      Go Home
                    </button>
                  </Link>
                </div>
                <div className="mt-10">
                  <Image
                    src="/image/404.png"
                    alt="404 page"
                    width={700}
                    height={272}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Custom404;
