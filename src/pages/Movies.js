import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Pagination from "../components/Pagination";
import { Link, useRouteMatch } from "react-router-dom";
import UserContext from "../Context/UserContext";

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loader, setLoader] = useState(false);

  const value = useContext(UserContext);

  useEffect(() => {
    fetchMovies(1);
    // console.log(value);
    return () => {
      setMovies([]);
    };
  }, []);

  const fetchMovies = (page) => {
    if (page !== 1) {
      window.location.search = "page=" + page;
    }
    let pg = new URLSearchParams(window.location.search).get("page") || 1;
    setLoader(true);
    let url =
      "http://192.168.3.7:8001/api/posts?type=movie&order=year|desc&page=" + pg;
    axios.get(url).then((res) => {
      let data = res.data.data;
      // data.map((el) => {
      //   el.img = "https://wiflix.biz/wfimages/" + el.img;
      // });
      setMovies(data);
      setLoader(false);
      setCurrentPage(res.data.current_page);
      setLastPage(res.data.last_page);
    });
  };

  const handlePaginate = (page) => {
    // console.log(page);
    if (page === 1) {
      page = "1";
    }
    fetchMovies(page);
  };

  let { path, url } = useRouteMatch();
  return (
    <>
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 relative"
        style={{ minHeight: 700 }}
      >
        {movies.map((movie) => (
          <Link
            to={`movie/${movie.id}/${movie.slug}`}
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
              style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
            >
              <span className="font-bold">{movie.title}</span>
            </div>
          </Link>
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
