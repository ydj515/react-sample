import React from "react";

const Header = () => {
  return (
    <header className="bg-blue-600 p-4 text-white">
      <div className="">
        <h1 className="text-2xl">My Website</h1>
        <nav>
          <ul className="flex gap-4">
            <li>
              <a href="/" className="hover:underline">
                Home
              </a>
            </li>
            <li>
              <a href="/about" className="hover:underline">
                About
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
