import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "../components/Pagination";

export default function Series() {
  const [series, setSeries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    fetchSeries(1);
    return () => {
      setSeries([]);
    };
  }, []);

  const fetchSeries = (page) => {
    if (page !== 1) {
      window.location.search = "page=" + page;
    }
    let pg = new URLSearchParams(window.location.search).get("page") || 1;
    setLoader(true);
    let url = "http://192.168.3.7:8001/api/posts?type=serie&page=" + pg;
    axios.get(url).then((res) => {
      let data = res.data.data;
      // data.map((el) => {
      //   el.img = "https://wiflix.biz/wfimages/" + el.img;
      // });
      setSeries(data);
      setLoader(false);
      setCurrentPage(res.data.current_page);
      setLastPage(res.data.last_page);
    });
  };

  const handlePaginate = (page) => {
    if (page === 1) {
      page = "1";
    }
    fetchSeries(page);
  };
  return (
    <>
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 relative"
        style={{ minHeight: 700 }}
      >
        {series.map((serie) => (
          <a
            href={`serie/${serie.id}/${serie.slug}`}
            className="relative rounded-md hover:scale-105 transition-transform"
            style={{ height: 400 }}
            key={serie.id}
          >
            <img
              src={serie.img}
              alt=""
              className="absolute top-0 left-0 w-full h-full z-40 rounded-md"
            />
            <span className="absolute top-1 left-1 bg-indigo-500 text-md font-bold text-white p-2 rounded-md z-50">
              Ep {serie.latest_ep}
            </span>
            <span className="absolute top-1 right-1 bg-purple-500 text-md font-bold text-white p-2 rounded-md z-50">
              S {serie.season}
            </span>
            <div
              className="absolute bottom-0 left-0 w-full h-14 p-2 z-50 text-white flex items-center justify-center rounded-b-md"
              style={{ backgroundColor: "#30365aa4" }}
            >
              <span className="font-bold">{serie.title}</span>
            </div>
          </a>
        ))}

        {loader ? (
          <div className="absolute top-0 bottom-0 left-0 right-0 w-full h-full flex justify-center items-center loader-container">
            <p className="loader"></p>
          </div>
        ) : null}
      </div>
      <Pagination
        currentPage={currentPage}
        lastPage={lastPage}
        handleClick={handlePaginate}
      />
    </>
  );
}
