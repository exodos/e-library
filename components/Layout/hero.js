import Head from "next/head";

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
      <div className="min-h-full bg-white">
        <div>{children}</div>

        <div className="mt-5 pt-5 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <footer
            className="sm:flex sm:items-center bg-no-repeat"
            style={{
              backgroundImage: 'url("/image/Ethio-footer.png")',
            }}
          >
            <div className="max-w-8xl mx-auto px-4 py-40 sm:px-4 lg:px-6">
              <div className="flex justify-start space-x-10 md:order-2">
                <p className="text-center text-base text-gray-400">
                  &copy; 2020 ethio telecom. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Hero;
