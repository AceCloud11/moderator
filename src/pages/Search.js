import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Pagination from "../components/Pagination";
import { Link, useLocation, useRouteMatch } from "react-router-dom";
import UserContext from "../Context/UserContext";

export default function Search() {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loader, setLoader] = useState(false);

  const value = useContext(UserContext);
  const { search } = useLocation();

  const searchParams = new URLSearchParams(search);

    let query = searchParams.get('q');

    useEffect(() => {
    fetchMovies(1);
    return () => {
      setMovies([]);
    };
  }, []);

  const fetchMovies = (page) => {
    setLoader(true);
    let url = "http://192.168.3.7:8001/api/posts?order=year|desc&search=" + query + "&page=" + page;
    axios.get(url).then((res) => {
      // console.log(res.data);
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
    fetchMovies(page);
  };

  let { path, url } = useRouteMatch();
  return (
    <>
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 relative pb-8"
        style={{ minHeight: 700 }}
      >
        {movies.map((movie) => (
          <Link
            to={
              movie.type == "movie"
                ? `movie/${movie.id}/${movie.slug}`
                : `serie/${movie.id}/${movie.slug}`
            }
            className="relative rounded-md hover:scale-105 transition-transform"
            style={{ height: 400 }}
            key={movie.id}
          >
            {movie.type == "serie" ? (
              <>
                <span className="absolute top-1 left-1 bg-indigo-500 text-md font-bold text-white p-2 rounded-md z-50">
                  Ep {movie.latest_ep}
                </span>
                <span className="absolute top-1 right-1 bg-purple-500 text-md font-bold text-white p-2 rounded-md z-50">
                  S {movie.season}
                </span>
              </>
            ) : null}
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
          </Link>
        ))}

        {loader ? (
          <div className="absolute top-0 bottom-0 left-0 right-0 w-full h-full flex justify-center items-center loader-container">
            <p className="loader"></p>
          </div>
        ) : null}
      </div>
     {
         lastPage > 1 
         ? ( <Pagination
        currentPage={currentPage}
        lastPage={lastPage}
        handleClick={handlePaginate}
      />)
      : null
     }
    </>
  );
}
