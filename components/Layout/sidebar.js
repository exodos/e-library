import { signOut, useSession } from "next-auth/react";
import { Fragment, useContext, useEffect, useState } from "react";
import Image from "next/image";
import { Dialog, Menu, Transition, Disclosure } from "@headlessui/react";
import Link from "next/link";
import {
  HomeIcon,
  MenuAlt1Icon,
  XIcon,
  LightningBoltIcon,
  SupportIcon,
  DocumentReportIcon,
  CheckCircleIcon,
  UploadIcon,
  ChevronDownIcon,
  UsersIcon,
} from "@heroicons/react/solid";
import SearchBooks from "../books/search-books";
import {
  BookOpenIcon,
  CurrencyDollarIcon,
  CogIcon,
} from "@heroicons/react/solid";
import { baseUrl } from "../../client/config";
import useSWR from "swr";
import { UserContext } from "../../store/user-context";

const navigation = [
  { name: "Dashboard", icon: HomeIcon, current: true, href: "/" },
  {
    name: "Commericial",
    icon: CurrencyDollarIcon,
    current: false,
    children: [
      { name: "Customer Service", href: `/nav/Customer Service` },
      { name: "Marketing", href: `/nav/Marketing` },
      { name: "Sales", href: `/nav/Sales` },
    ],
  },
  {
    name: "Support",
    icon: SupportIcon,
    current: false,
    children: [
      {
        name: "Strategic Program Mgt",
        href: `/nav/Strategic Program Management`,
      },
      { name: "HR", href: `/nav/HR` },
      { name: "Finanace", href: `/nav/Finanace` },
      {
        name: "Customer Experience & Qlt Mgt",
        href: `/nav/Customer Experience And Quality Management`,
      },
      {
        name: "TeXA",
        href: `/nav/Telecom Excellence Academy`,
      },
      { name: "Supply & Chain", href: `/nav/Supply And Chain` },

      { name: "Facilities & Fleet", href: `/nav/Facilities And Fleet` },
      { name: "Internal Audit", href: `/nav/Internal Audit` },
      { name: "Legal", href: `/nav/Legal` },
      { name: "Physical Security", href: `/nav/Physical Security` },
      { name: "Communication", href: `/nav/Communication` },
      {
        name: "Ethics & Anticorruption",
        href: `/nav/Ethics And Anticorruption`,
      },
      {
        name: "Zone/Regional Coordination",
        href: `/nav/Zone Or Regional Coordination`,
      },
    ],
  },
  {
    name: "Technical",
    icon: CogIcon,
    current: false,
    children: [
      { name: "Information Systems", href: `/nav/Information Systems` },
      { name: "Information Security", href: `/nav/Information Security` },
      { name: "Wireless Network", href: `/nav/Wireless Network` },
      { name: "Network Infrastructure", href: `/nav/Network Infrastructure` },
      {
        name: "Network Operation Service Management",
        href: `/nav/Network Operation Service Management`,
      },
      { name: "Fixed Network", href: `/nav/Fixed Network` },
      { name: "CTO ", href: `/nav/CTO` },
    ],
  },
  {
    name: "Leadership & Management",
    icon: UsersIcon,
    href: `/nav/Leadership And Management`,
  },
  {
    name: "Others",
    icon: LightningBoltIcon,
    current: false,
    children: [{ name: "Transversal", href: "/nav/Transversal" }],
  },
  { name: "Online Catelog", icon: BookOpenIcon, href: "/catalogue" },
];

const secondaryNavigation = [
  {
    name: "Reports",
    icon: DocumentReportIcon,
    current: false,
    children: [
      { name: "Page Visitor", href: `/report/page-visitor` },
      { name: "Most Read Books", href: `/report/read-books` },
      { name: "Export Report", href: "/report/report-export" },
    ],
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Sidebar = (props) => {
  const { user } = useContext(UserContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    return "Loading";
  }

  let adminRole = false;
  let contributorRole = false;

  if (user.role === "ADMIN") {
    adminRole = true;
  }
  if (user.role === "ADMIN" || user.role === "CONTRIBUTOR") {
    contributorRole = true;
  }
  return (
    <>
      <div className="min-h-ful">
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 flex z-40 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex-shrink-0 flex items-center px-4">
                  <Image
                    className="h-8 w-auto"
                    src="/logo/ethiotelecom.png"
                    alt="Ethiotelecom logo"
                    width={200}
                    height={56}
                  />
                </div>
                <nav
                  className="flex-1 px-2  space-y-1 bg-white"
                  aria-label="Sidebar"
                >
                  {navigation.map((item) =>
                    !item.children ? (
                      <div key={item.name}>
                        <Link href={item.href}>
                          <a
                            // href="#"
                            className={classNames(
                              item.current
                                ? "bg-gray-100 text-gray-900"
                                : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                              "group w-full flex items-center pl-2 py-2 text-sm font-medium rounded-md"
                            )}
                          >
                            <item.icon
                              className={classNames(
                                item.current
                                  ? "text-lightGreen"
                                  : "text-lightGreen group-hover:text-deepGreen",
                                "mr-3 flex-shrink-0 h-6 w-6"
                              )}
                              aria-hidden="true"
                            />
                            {item.name}
                          </a>
                        </Link>
                      </div>
                    ) : (
                      <Disclosure
                        as="div"
                        key={item.name}
                        className="space-y-1"
                      >
                        {({ open }) => (
                          <>
                            <Disclosure.Button
                              className={classNames(
                                item.current
                                  ? "bg-gray-100 text-gray-900"
                                  : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                                "group w-full flex items-center pl-2 pr-1 py-2 text-left text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              )}
                            >
                              <item.icon
                                className="mr-3 flex-shrink-0 h-6 w-6 text-lightGreen group-hover:text-deepGreen"
                                aria-hidden="true"
                              />
                              <span className="flex-1">{item.name}</span>
                              <svg
                                className={classNames(
                                  open
                                    ? "text-gray-400 rotate-90"
                                    : "text-gray-300",
                                  "ml-3 flex-shrink-0 h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150"
                                )}
                                viewBox="0 0 20 20"
                                aria-hidden="true"
                              >
                                <path
                                  d="M6 6L14 10L6 14V6Z"
                                  fill="currentColor"
                                />
                              </svg>
                            </Disclosure.Button>
                            <Disclosure.Panel className="space-y-1">
                              {item.children.map((subItem) => (
                                <Link key={subItem.name} href={subItem.href}>
                                  <a>
                                    <Disclosure.Button
                                      key={subItem.name}
                                      // as="a"
                                      // href={subItem.href}
                                      className="group w-full flex items-center pl-11 pr-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50"
                                    >
                                      {subItem.name}
                                    </Disclosure.Button>
                                  </a>
                                </Link>
                              ))}
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    )
                  )}
                  {/* secondary */}
                  <div className="mt-3 pt-3 divide-x-2 border-t-2">
                    <div className="px-2 space-y-1">
                      {adminRole &&
                        secondaryNavigation.map((item) =>
                          !item.children ? (
                            <div key={item.name}>
                              <Link href={item.href}>
                                <a
                                  // href="#"
                                  className={classNames(
                                    item.current
                                      ? "bg-gray-100 text-gray-900"
                                      : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                                    "group w-full flex items-center pl-2 py-2 text-sm font-medium rounded-md"
                                  )}
                                >
                                  <item.icon
                                    className={classNames(
                                      item.current
                                        ? "text-lightGreen"
                                        : "text-lightGreen group-hover:text-deepGreen",
                                      "mr-3 flex-shrink-0 h-6 w-6"
                                    )}
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </a>
                              </Link>
                            </div>
                          ) : (
                            <Disclosure
                              as="div"
                              key={item.name}
                              className="space-y-1"
                            >
                              {({ open }) => (
                                <>
                                  <Disclosure.Button
                                    className={classNames(
                                      item.current
                                        ? "bg-gray-100 text-gray-900"
                                        : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                                      "group w-full flex items-center pl-2 pr-1 py-2 text-left text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    )}
                                  >
                                    <item.icon
                                      className="mr-3 flex-shrink-0 h-6 w-6 text-lightGreen group-hover:text-deepGreen"
                                      aria-hidden="true"
                                    />
                                    <span className="flex-1">{item.name}</span>
                                    <svg
                                      className={classNames(
                                        open
                                          ? "text-gray-400 rotate-90"
                                          : "text-gray-300",
                                        "ml-3 flex-shrink-0 h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150"
                                      )}
                                      viewBox="0 0 20 20"
                                      aria-hidden="true"
                                    >
                                      <path
                                        d="M6 6L14 10L6 14V6Z"
                                        fill="currentColor"
                                      />
                                    </svg>
                                  </Disclosure.Button>
                                  <Disclosure.Panel className="space-y-1">
                                    {item.children.map((subItem) => (
                                      <Link
                                        key={subItem.name}
                                        href={subItem.href}
                                      >
                                        <a>
                                          <Disclosure.Button
                                            key={subItem.name}
                                            // as="a"
                                            // href={subItem.href}
                                            className="group w-full flex items-center pl-11 pr-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50"
                                          >
                                            {subItem.name}
                                          </Disclosure.Button>
                                        </a>
                                      </Link>
                                    ))}
                                  </Disclosure.Panel>
                                </>
                              )}
                            </Disclosure>
                          )
                        )}
                    </div>
                  </div>
                </nav>
              </div>
            </Transition.Child>
            <div className="flex-shrink-0 w-14" aria-hidden="true">
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <div className="flex flex-col flex-grow border-r border-gray-200 pt-5 pb-4 bg-white overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4 mb-3">
              <Image
                className="h-8 w-auto"
                src="/logo/ethiotelecom.png"
                alt="Ethiotelecom logo"
                width={200}
                height={56}
              />
            </div>
            <nav
              className="flex-1 px-2 space-y-1 bg-white"
              aria-label="Sidebar"
            >
              {navigation.map((item) =>
                !item.children ? (
                  <div key={item.name}>
                    <Link href={item.href}>
                      <a
                        className={classNames(
                          item.current
                            ? "bg-gray-100 text-gray-900"
                            : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                          "group w-full flex items-center pl-2 py-2 text-sm font-medium rounded-md"
                        )}
                      >
                        <item.icon
                          className={classNames(
                            item.current
                              ? "text-lightGreen"
                              : "text-lightGreen group-hover:text-deepGreen",
                            "mr-3 flex-shrink-0 h-6 w-6"
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </a>
                    </Link>
                  </div>
                ) : (
                  <Disclosure as="div" key={item.name} className="space-y-1">
                    {({ open }) => (
                      <>
                        <Disclosure.Button
                          className={classNames(
                            item.current
                              ? "bg-gray-100 text-gray-900"
                              : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                            "group w-full flex items-center pl-2 pr-1 py-2 text-left text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          )}
                        >
                          <item.icon
                            className="mr-3 flex-shrink-0 h-6 w-6 text-lightGreen group-hover:text-deepGreen"
                            aria-hidden="true"
                          />
                          <span className="flex-1">{item.name}</span>
                          <svg
                            className={classNames(
                              open
                                ? "text-gray-400 rotate-90"
                                : "text-gray-300",
                              "ml-3 flex-shrink-0 h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150"
                            )}
                            viewBox="0 0 20 20"
                            aria-hidden="true"
                          >
                            <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
                          </svg>
                        </Disclosure.Button>
                        <Disclosure.Panel className="space-y-1">
                          {item.children.map((subItem) => (
                            <Link key={subItem.name} href={subItem.href}>
                              <a>
                                <Disclosure.Button
                                  key={subItem.name}
                                  // as="a"
                                  // href={subItem.href}
                                  className="group w-full flex items-center pl-11 pr-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50"
                                >
                                  {subItem.name}
                                </Disclosure.Button>
                              </a>
                            </Link>
                          ))}
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                )
              )}

              <div className="mt-3 pt-3 divide-x-2 border-t-2">
                <div className="px-2 space-y-1">
                  {adminRole &&
                    secondaryNavigation.map((item) =>
                      !item.children ? (
                        <div key={item.name}>
                          <Link href={item.href}>
                            <a
                              className={classNames(
                                item.current
                                  ? "bg-gray-100 text-gray-900"
                                  : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                                "group w-full flex items-center pl-2 py-2 text-sm font-medium rounded-md"
                              )}
                            >
                              <item.icon
                                className={classNames(
                                  item.current
                                    ? "text-lightGreen"
                                    : "text-lightGreen group-hover:text-deepGreen",
                                  "mr-3 flex-shrink-0 h-6 w-6"
                                )}
                                aria-hidden="true"
                              />
                              {item.name}
                            </a>
                          </Link>
                        </div>
                      ) : (
                        <Disclosure
                          as="div"
                          key={item.name}
                          className="space-y-1"
                        >
                          {({ open }) => (
                            <>
                              <Disclosure.Button
                                className={classNames(
                                  item.current
                                    ? "bg-gray-100 text-gray-900"
                                    : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                                  "group w-full flex items-center pl-2 pr-1 py-2 text-left text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                )}
                              >
                                <item.icon
                                  className="mr-3 flex-shrink-0 h-6 w-6 text-lightGreen group-hover:text-deepGreen"
                                  aria-hidden="true"
                                />
                                <span className="flex-1">{item.name}</span>
                                <svg
                                  className={classNames(
                                    open
                                      ? "text-gray-400 rotate-90"
                                      : "text-gray-300",
                                    "ml-3 flex-shrink-0 h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150"
                                  )}
                                  viewBox="0 0 20 20"
                                  aria-hidden="true"
                                >
                                  <path
                                    d="M6 6L14 10L6 14V6Z"
                                    fill="currentColor"
                                  />
                                </svg>
                              </Disclosure.Button>
                              <Disclosure.Panel className="space-y-1">
                                {item.children.map((subItem) => (
                                  <Link key={subItem.name} href={subItem.href}>
                                    <a>
                                      <Disclosure.Button
                                        key={subItem.name}
                                        // as="a"
                                        // href={subItem.href}
                                        className="group w-full flex items-center pl-11 pr-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50"
                                      >
                                        {subItem.name}
                                      </Disclosure.Button>
                                    </a>
                                  </Link>
                                ))}
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>
                      )
                    )}
                </div>
              </div>
            </nav>
          </div>
        </div>
        <div className="lg:pl-64 flex flex-col flex-1">
          <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 lg:border-none">
            <button
              type="button"
              className="px-4 border-r border-gray-200 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <MenuAlt1Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            {/* Search bar */}

            <div className="flex-1 px-4 flex justify-between sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
              <SearchBooks />
              <div className="ml-4 flex items-center md:ml-6">
                <button
                  type="button"
                  className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                >
                  <span className="sr-only">View notifications</span>
                  {/* <BellIcon className="h-6 w-6" aria-hidden="true" /> */}
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="ml-3 relative">
                  <div>
                    <Menu.Button className="max-w-xs bg-white rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 lg:p-2 lg:rounded-md lg:hover:bg-gray-50">
                      <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                        <svg
                          className="absolute w-12 h-12 text-gray-400 -left-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                      <span className="hidden ml-3 text-gray-700 text-sm font-medium lg:block">
                        <span className="sr-only">Open user menu for </span>
                        {user.fullName}
                      </span>
                      <ChevronDownIcon
                        className="hidden flex-shrink-0 ml-1 h-5 w-5 text-gray-400 lg:block"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={
                              () => signOut()
                              // signOut({
                              //   redirect: false,
                              //   callbackUrl: `${process.env.NEXTAUTH_URL}/auth/sign-in`,
                              //   // callbackUrl:"http://localhost:3000/auth/sign-in"
                              // })
                            }
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Logout
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
            <div className="pt-7 pr-8">
              <Image
                className="h-8 w-auto"
                src="/image/Texa-logo.png"
                alt="Ethiotelecom logo"
                width={200}
                height={46}
              />
            </div>
          </div>
          <main className="flex-1 mb-8">
            <div className="bg-white shadow">
              <div className="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
                {/* <UserList user={user} /> */}

                <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                        <svg
                          className="absolute w-12 h-12 text-gray-400 -left-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                            {/* Welcome To CLMS, {user.fullName} */}
                            Welcome to TExA e-Library
                          </h1>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
                    {contributorRole && (
                      <Link href={"/books/upload"}>
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
                    )}
                    {/* {status === "authenticated" && session.user.name === "tsegay" && ( */}
                    {adminRole && (
                      <Link href={"/publish"}>
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
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8">{props.children}</div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
