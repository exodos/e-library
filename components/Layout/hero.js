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
        {/* <div>{children}</div> */}
        <footer className="bg-white" aria-label="footer-heading">
          <h2 id="footer-heading" className="sr-only">
            Footer
          </h2>
          <div className="max-w-8xl mx-auto py-8 px-4 sm:px-6 lg:py-7 lg:px-8">
            {/* <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8"> */}

            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto pt-4">
                <Image
                  className="h-8 w-auto"
                  src="/image/Ethio_footer_left.png"
                  alt="Ethiotelecom Left Footer"
                  width={140}
                  height={234}
                />
              </div>

              <div className="flex-1 px-4 flex justify-between sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
                <p className="text-base text-gray-400">
                  &copy; 2022 ethio telecom. All rights reserved
                </p>
              </div>
              <div className="sm:mt-0 sm:ml-8 sm:flex-none pt-4">
                <Image
                  className="h-8 w-auto"
                  src="/image/Ethio_footer_right.png"
                  alt="Ethiotelecom Right Footer"
                  width={220}
                  height={200}
                />
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Hero;
