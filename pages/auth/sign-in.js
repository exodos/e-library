import React from "react";
import { getCsrfToken } from "next-auth/react";
import Image from "next/image";
import SignInError from "./signin-error";
import { useRouter } from "next/router";

const SignIn = ({ csrfToken }) => {
  const { error } = useRouter().query;
  return (
    <>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto pt-8">
            <Image
              className="h-8 w-auto"
              src="/image/Ethiotelcom_Logo.png"
              alt="Ethiotelecom logo"
              width={250}
              height={69}
            />
          </div>
          <div className="sm:mt-0 sm:ml-16 sm:flex-none pt-8">
            <Image
              className="h-8 w-auto"
              src="/image/Texa-logo.png"
              alt="TExA Logo"
              width={250}
              height={69}
            />
          </div>
        </div>
        <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Welcome to TExA e-Library
            </h2>
          </div>
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 sm:rounded-lg sm:px-10">
              <form
                className="space-y-6"
                method="post"
                action="/api/auth/callback/credentials"
              >
                <div>
                  <input
                    id="csrfToken"
                    name="csrfToken"
                    type="hidden"
                    defaultValue={csrfToken}
                  />
                </div>
                <div className="flex items-center border-b border-teal-500 py-2">
                  <input
                    className="appearance-none mt-1 bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Username"
                    required
                  />
                </div>
                <div className="flex items-center border-b border-teal-500 py-2">
                  <input
                    className="appearance-none mt-1 bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                    placeholder="Password"
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                  />
                </div>
                <div className="text-eRed text-sm pt-2">
                  {error && <SignInError error={error} />}
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full flex justify-center py-4 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-lightGreen hover:bg-deepGreen focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lightGreen"
                  >
                    LOGIN
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="mt-10 pt-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
        <footer
          className="sm:flex sm:items-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/image/Ethio-footer.png")',
          }}
        >
          <div className="max-w-6xl mx-auto px-4 py-40 sm:px-4 lg:px-6">
            <div className="flex justify-start space-x-10 md:order-2">
              <p className="text-center text-base text-gray-400">
                &copy; 2020 ethio telecom. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div> */}
    </>
  );
};

export const getServerSideProps = async (context) => {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
};

export default SignIn;