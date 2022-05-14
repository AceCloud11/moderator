import React, { useEffect } from "react";
import { Select } from "@chakra-ui/react";
import { useRouteMatch } from "react-router-dom";
import './css/nav.scss';

export default function Filter({ search, setSearch, handleClick }) {

    const topMenuClick = (e) => {
        e.preventDefault();
        const el = e.target;
        const url = e.target.dataset.url;
        el.classList.add("bg-blue-500", "link-top-active");
        
        let links = document.querySelectorAll('.top-link');
        
        links.forEach(element => {
            element.classList.remove("link-top-active");
        });
        window.location = url;
    }
    
  return (
    <div className="container mx-auto my-8 flex justify-between gap-4 items-center flex-wrap md:flex-nowrap">
      <div>
        <ul className="flex gap-4">
          <li>
            <button
              data-url="/"
              className="px-4 py-2 rounded-md top-link"
              style={{ backgroundColor: "#30365aa4" }}
              onClick={(e) => topMenuClick(e)}
            >
              Accueil
            </button>
          </li>
          <li>
            <button
              data-url="/movies"
              className="px-4 py-2 rounded-md top-link"
              style={{ backgroundColor: "#30365aa4" }}
              onClick={(e) => topMenuClick(e)}
            >
              Films
            </button>
          </li>
          <li>
            <button
              data-url="/series"
              className="px-4 py-2 rounded-md top-link"
              style={{ backgroundColor: "#30365aa4" }}
              onClick={(e) => topMenuClick(e)}
            >
              Séries
            </button>
          </li>
        </ul>
      </div>

      <div className="flex justify-center items-center">
        <div className="xl:w-96">
          <div className="input-group relative flex items-stretch w-full">
            <input
              type="search"
              className="form-control relative flex-auto min-w-0 block w-full px-3 py-1.5 text-base font-normal text-gray-400 bg-white bg-clip-padding border-none border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-400 focus:bg-white focus:border-blue-600 focus:outline-none"
              placeholder="Search"
              style={{
                backgroundColor: "#30365aa4",
              }}
              value={search}
              onChange={setSearch}
            />
            <button
              className="btn inline-block px-6 py-2.5 bg-blue-700 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700  focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out flex items-center"
              type="button"
              id="button-addon2"
              onClick={handleClick}
            >
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="search"
                className="w-4"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
