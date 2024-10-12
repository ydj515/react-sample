import React from "react";

const Header = () => {
  return (
    <header className="relative z-50 w-full flex-none text-sm font-semibold leading-6 text-slate-900">
      <nav
        aria-label="Global"
        className="max-w-container mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="relative flex items-center py-[2.125rem]">
          <div className="absolute inset-x-0 bottom-0 h-px bg-slate-900/5" />
          <a className="flex-none text-slate-900" href="/">
            <img
              className="mx-auto h-10 w-auto"
              src="/public/vite.svg"
              alt="Your Company"
            />
          </a>

          <div className="ml-auto hidden lg:flex lg:items-center">
            <a href="/#">some</a>
            <a className="ml-8" href="/#">
              some
            </a>
            <a className="ml-8" href="/#">
              some
            </a>
            <a className="ml-8" href="/#">
              some
            </a>
          </div>
          <button
            type="button"
            className="-my-1 ml-auto flex h-8 w-8 items-center justify-center rounded-lg lg:ml-8"
          >
            <span className="sr-only">Search components</span>
            <svg
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 fill-gray-900 hover:fill-gray-900"
            >
              <path d="M20.47 21.53a.75.75 0 1 0 1.06-1.06l-1.06 1.06Zm-9.97-4.28a6.75 6.75 0 0 1-6.75-6.75h-1.5a8.25 8.25 0 0 0 8.25 8.25v-1.5ZM3.75 10.5a6.75 6.75 0 0 1 6.75-6.75v-1.5a8.25 8.25 0 0 0-8.25 8.25h1.5Zm6.75-6.75a6.75 6.75 0 0 1 6.75 6.75h1.5a8.25 8.25 0 0 0-8.25-8.25v1.5Zm11.03 16.72-5.196-5.197-1.061 1.06 5.197 5.197 1.06-1.06Zm-4.28-9.97c0 1.864-.755 3.55-1.977 4.773l1.06 1.06A8.226 8.226 0 0 0 18.75 10.5h-1.5Zm-1.977 4.773A6.727 6.727 0 0 1 10.5 17.25v1.5a8.226 8.226 0 0 0 5.834-2.416l-1.061-1.061Z" />
            </svg>
          </button>
          <button
            type="button"
            className="-my-1 -mr-1 ml-6 flex h-8 w-8 items-center justify-center lg:hidden"
          >
            <span className="sr-only">Open navigation</span>
            <svg viewBox="0 0 24 24" className="h-6 w-6 stroke-slate-900">
              <path
                d="M3.75 12h16.5M3.75 6.75h16.5M3.75 17.25h16.5"
                fill="none"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <div className="hidden lg:ml-8 lg:flex lg:items-center lg:border-l lg:border-slate-900/15 lg:pl-8">
            <a href="/signin">Sign in</a>
            <a
              className="-my-2.5 ml-8 inline-flex justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
              href="/#"
            >
              <span>
                some <span aria-hidden="true">→</span>
              </span>
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
