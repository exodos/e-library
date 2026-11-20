import Head from "next/head";
import Image from "next/image";

const Hero = ({ children }) => {
  return (
    <>
      <Head>
        <title>Corporate Library Management System</title>
        <meta
          name="description"
          content="Corporate Library Management System"
        />
      </Head>
      <div className="h-screen bg-white">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
        <footer className="bg-white" aria-label="footer-heading">
          <h2 id="footer-heading" className="sr-only">
            Footer
          </h2>
          <div className="max-w-8xl mx-auto py-8 px-4 sm:px-6 lg:py-7 lg:px-8">

            <div className="sm:flex sm:items-center">
            <div className="flex-1 px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
              <p className="text-center text-base text-gray-400">
                &copy; 2022 ethio telecom. All rights reserved
                </p>
            </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Hero;
