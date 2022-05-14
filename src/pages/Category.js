import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Pagination from "../components/Pagination";

export default function Category() {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loader, setLoader] = useState(false);

  const { id } = useParams();
  useEffect(() => {
    fetchMovies(1);

    return () => {
      setMovies([]);
      setCurrentPage(1);
      setLastPage(1);
      setLoader(false);
    };
  }, []);

  const fetchMovies = (page) => {
    if (page !== 1) {
      window.location.search = "page=" + page;
    }
    let pg = new URLSearchParams(window.location.search).get("page") || 1;
    let url = "http://192.168.3.7:8001/api/categories/" + id + "?page=" + pg;
    setLoader(true);
    axios
      .get(url)
      .then((res) => {
        let data = res.data;
        // data.data.forEach((element) => {
        //   element.img = "https://wiflix.biz/wfimages/" + element.img;
        // });
        setMovies(data.data);
        setCurrentPage(data.current_page);
        setLastPage(data.last_page);
        setLoader(false);
      })
      .catch((err) => {
        throw err;
      });
  };

  const handlePaginate = (page) => {
    fetchMovies(page);
  };

  return (
    <>
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 relative"
        style={{ minHeight: 700 }}
      >
        {movies
          ? movies.map((movie) => (
              <a
                href={
                  movie.type == "movie"
                    ? `/movie/${movie.id}/${movie.slug}`
                    : `/serie/${movie.id}/${movie.slug}`
                }
                className="relative rounded-md hover:scale-105 transition-transform"
                style={{ height: 400 }}
                key={movie.id}
              >
                <img
                  src={movie.img}
                  alt=""
                  className="absolute top-0 left-0 w-full h-full z-40 rounded-md"
                />
                <div
                  className="absolute bottom-0 left-0 w-full h-14 p-2 z-50 text-white flex items-center justify-center rounded-b-md"
                  style={{ backgroundColor: "#30365aa4" }}
                >
                  <span className="font-bold">{movie.title}</span>
                </div>
              </a>
            ))
          : null}

        {/* <div className="text-white">cats movies & series</div> */}

        {loader ? (
          <div className="absolute top-0 bottom-0 left-0 right-0 w-full h-full flex justify-center items-center loader-container">
            <p className="loader"></p>
          </div>
        ) : null}
      </div>
      {lastPage !== 1 ? (
        <Pagination
          currentPage={currentPage}
          lastPage={lastPage}
          handleClick={handlePaginate}
        />
      ) : null}
    </>
  );
}
