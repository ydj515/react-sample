import React from "react";
import Layout from "@/components/Layout";

const Home = () => {
  return (
    <Layout>
      <h2 className="text-3xl">Welcome to the Home Page</h2>
      <p className="mt-4">
        This is the home page of the website. Enjoy browsing!
      </p>
      <details className="dropdown">
        <summary className="btn m-1">open or close</summary>
        <ul className="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow">
          <li>
            <a>Item 1</a>
          </li>
          <li>
            <a>Item 2</a>
          </li>
        </ul>
      </details>

      <button
        className="btn"
        onClick={() => document.getElementById("my_modal_2").showModal()}
      >
        open modal
      </button>
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Hello!</h3>
          <p className="py-4">Press ESC key or click outside to close</p>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </Layout>
  );
};

export default Home;
