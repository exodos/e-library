import React from "react";
import Image from "next/image";
import Link from "next/link";
import etPremium from "../public/logo/et-premium.jpg";

const Custom404 = () => {
  return (
    <>
      <div className="mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mt-2 bg-gray-100 min-h-full flex flex-col lg:relative">
            <div className="flex-grow flex flex-col">
              <main className="flex-grow flex flex-col bg-white">
                <div className="flex-grow mx-auto max-w-7xl w-full flex flex-col px-6 sm:px-6 lg:px-8">
                  <div className="flex-shrink-0 pt-10 sm:pt-16">
                    <Link href="/">
                      <a className="inline-flex">
                        <span className="sr-only">ethio telecom</span>
                        <Image
                          src="/logo/et-logo.png"
                          alt="Et Logo"
                          width={75}
                          height={75}
                        />
                      </a>
                    </Link>
                  </div>
                  <div className="flex-shrink-0 my-auto py-16 sm:py-32">
                    <p className="text-sm font-semibold text-eRed uppercase tracking-wide">
                      404 error
                    </p>
                    <h1 className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                      Page not found
                    </h1>
                    <p className="mt-2 text-base text-gray-700">
                      Sorry, we could not find the page you are looking for.
                    </p>
                    <div className="mt-6">
                      <Link href="/">
                        <a className="text-base font-semibold text-lightGreen hover:text-deepGreen">
                          Go back home<span aria-hidden="true"> &rarr;</span>
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              </main>
            </div>
            <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
              <div className="absolute inset-0 h-full w-full object-cover">
                <Image
                  src={etPremium}
                  alt="Et Premium"
                  // width={300}
                  // height={500}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Custom404;
