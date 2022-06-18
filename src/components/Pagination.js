import React, { useState } from "react";

export default function Pagination({ handleClick, currentPage, lastPage }) {
  const [num, setNum] = useState(null);

  return (
    <div>
      <div
        id=""
        className="flex justify-center items-center py-8 pagination"
        ng-if="!search && !sortDate && !sortTitle"
      >
        <ul className="flex gap-2 sm:gap-4 flex-wrap justify-center items-center">
          <li>
            <button
              className="text-white pagination-item p-2 rounded-lg px-3 bg-blue-500"
              onClick={() => handleClick("1")}
            >
              <i className="fa-solid fa-angles-left text-white text-xl"></i>
            </button>
          </li>
          <li>
            <button
              className="text-white pagination-item p-2 rounded-lg px-3 bg-blue-500"
              onClick={() =>
                handleClick(currentPage == 1 ? 1 : currentPage - 1)
              }
            >
              <i className="fa-solid fa-angle-left text-white text-xl"></i>
            </button>
          </li>
          <li>
            <button className="text-white pagination-item p-2 rounded-lg px-3 bg-blue-500">
              {currentPage}
            </button>
          </li>
          <li>
            <button className="text-white pagination-item p-2 rounded-lg px-3 bg-blue-500">
              /
            </button>
          </li>
          <li>
            <button className="text-white pagination-item p-2 rounded-lg px-3 bg-blue-500">
              {lastPage}
            </button>
          </li>

          <li>
            <button
              className="text-white pagination-item p-2 rounded-lg px-3 bg-blue-500"
              onClick={() =>
                handleClick(
                  currentPage + 1 <= lastPage ? currentPage + 1 : lastPage
                )
              }
            >
              <i className="fa-solid fa-angle-right text-white text-xl"></i>
            </button>
          </li>
          <li>
            <button
              className="text-white pagination-item p-2 rounded-lg px-3 bg-blue-500"
              onClick={() => handleClick(lastPage)}
            >
              <i className="fa-solid fa-angles-right text-white text-xl"></i>
            </button>
          </li>
          <li className="mobile-hidden flex items-center gap-2">
            <input
              type="number"
              placeholder="Aller au numéro spécifique"
              className="p-2 rounded-md focus:outline-none text-black font-bold"
              onChange={(e) => setNum(e.target.value)}
            />
            <button
              className="pagination-item p-2 rounded-lg px-3 bg-blue-500"
              onClick={() => handleClick(num)}
            >
              <i className="fa-solid fa-magnifying-glass text-white text-xl"></i>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
