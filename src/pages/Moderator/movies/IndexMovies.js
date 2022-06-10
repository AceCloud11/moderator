import { Tfoot } from "@chakra-ui/table";
import axios from "axios";
import React, { Component } from "react";
import UserContext from "../../../Context/UserContext";
import Pagination from "../../../components/Pagination";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default class IndexMovies extends Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      currentPage: 1,
      lastPage: 1,
      token: "",
      role: "",
      search: "",
      searchId: "",
      sources: [],
      srcName: "",
      src: "",
      movieId: null,
      showModel: false,
    };
  }

  notify = (text) => toast.success(text);

  fetchMovies = async (page) => {
    if (page !== 1) {
      window.location.search = "page=" + page;
    }
    let pg = new URLSearchParams(window.location.search).get("page") || 1;
    let url = "/moderator/posts?type=movie&order=created_at|desc&page=" + pg;

    axios({
      url,
      method: "GET",
      responseType: "json",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + this.state.token,
      },
    })
      .then(async (response) => {
        // console.log(response);
        await this.setState({
          movies: response.data.data,
          currentPage: response.data.current_page,
          lastPage: response.data.last_page,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  searchMovies = async (page) => {
    let url =
      "/moderator/posts?type=movie&search=" +
      this.state.search +
      "&page=" +
      page;

    axios({
      url,
      method: "GET",
      responseType: "json",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + this.state.token,
      },
    })
      .then(async (response) => {
        await this.setState({
          movies: response.data.data,
          currentPage: response.data.current_page,
          lastPage: response.data.last_page,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  searchMoviesId = async () => {
    let url = "/moderator/posts/" + this.state.searchId;

    if (this.state.searchId !== "") {
      await axios({
        url,
        method: "GET",
        responseType: "json",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + this.state.token,
        },
      })
        .then(async (response) => {
          let arr = [];
          arr.push(response.data);
          await this.setState({
            movies: arr,
            currentPage: 1,
            lastPage: 1,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  deleteMovie = async (id) => {
    await axios({
      url: '/moderator/posts/' + id,
      method: "delete",
      responseType: "json",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + this.state.token,
      },
    })
      .then(async (response) => {
       await this.fetchMovies(1);
        this.notify(response.data.success);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  addToSlider = async (id) => {
    await axios({
      url: '/moderator/featured/' + id,
      method: "post",
      responseType: "json",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + this.state.token,
      },
    })
      .then(async (response) => {
      //  await this.fetchMovies(1);
        if (response.data.success) {
          this.notify(response.data.success);
        }else{
          toast.error(response.data.error);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }


  componentDidMount() {
    const { token, role } = this.context;
    this.setState(
      {
        token,
        role,
      },
      () => {
        this.fetchMovies(1);
      }
    );
  }
  render() {
    return (
      <div className="w-full relative">
        <ToastContainer />
        <h1 className="text-center text-xl font-bold hidden md:block">Films</h1>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <div className="p-4 flex flex-wrap justify-between items-center gap-4">
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="table-search"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Rechercher par nom"
                  value={this.state.search}
                  onChange={(e) => this.setState({ search: e.target.value })}
                />
                <button
                  className="p-2 bg-blue-500 text-white font-bold rounded-md"
                  onClick={(e) => {
                    e.preventDefault();
                    this.searchMovies(1);
                  }}
                >
                  Recherche
                </button>
              </div>
            </div>

            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="table-search"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Rechercher par identifiant"
                  value={this.state.searchId}
                  onChange={(e) => this.setState({ searchId: e.target.value })}
                />
                <button
                  className="p-2 bg-blue-500 text-white font-bold rounded-md"
                  onClick={(e) => {
                    e.preventDefault();
                    this.searchMoviesId();
                  }}
                >
                  Recherche
                </button>
              </div>
            </div>

            <a
              href="/moderator/movies/create"
              className="block px-4 py-2 rounded-md bg-indigo-600 text-white"
            >
              Ajouter un film
            </a>
          </div>
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="p-4">
                  <div className="flex items-center">ID</div>
                </th>
                <th scope="col" className="px-6 py-3">
                  Nom du film
                </th>
                <th scope="col" className="px-6 py-3">
                  Année de parution
                </th>
                <th scope="col" className="px-6 py-3">
                  Langue
                </th>
                <th scope="col" className="px-6 py-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {this.state.movies.length
                ? this.state.movies.map((movie) => (
                    <tr
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      key={movie.id}
                    >
                      <td className="w-4 p-4">
                        <div className="flex items-center">{movie.id}</div>
                      </td>
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                      >
                        {movie.title}
                      </th>
                      <td className="px-6 py-4">{movie.year}</td>
                      <td className="px-6 py-4">{movie.lang}</td>
                      <td className="px-6 py-4 text-right space-x-4">
                        <a
                          href={`/moderator/movies/${movie.id}/edit`}
                          className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-3"
                        >
                          Edit
                        </a>

                        <button
                          className="font-medium text-purple-600 dark:text-blue-500 hover:underline"
                          onClick={() => this.addToSlider(movie.id)}
                        >
                          Ajouter au curseur
                        </button>

                        <a
                          className="font-medium text-lime-600 dark:text-blue-500 hover:underline"
                          // onClick={() => {
                          //   this.setState({
                          //     movieId: movie.id,
                          //     showModel: true,
                          //   });
                          // }}
                          href={`/moderator/movies/${movie.id}/sources`}
                        >
                          Sources
                        </a>

                        <button
                          className="font-medium text-red-600 dark:text-blue-500 hover:underline"
                          onClick={() => this.deleteMovie(movie.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                : null}
            </tbody>

            {this.state.lastPage > 1 ? (
              <tfoot>
                <tr>
                  <th colSpan="4">
                    <Pagination
                      currentPage={this.state.currentPage}
                      lastPage={this.state.lastPage}
                      handleClick={
                        this.state.search !== ""
                          ? this.searchMovies
                          : this.fetchMovies
                      }
                    />
                  </th>
                </tr>
              </tfoot>
            ) : null}
          </table>
        </div>

        {/* Add sources Start */}
        <div
          className="min-w-screen h-screen animated fadeIn faster  fixed  left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover"
          id="modal-id"
          style={{ display: this.state.showModel ? "flex" : "none" }}
        >
          <div className="absolute bg-black opacity-80 inset-0 z-0"></div>
          <div className="w-full  max-w-xl p-5 relative mx-auto my-auto rounded-xl shadow-lg  bg-white ">
            {/* <!--content--> */}
            <div className="">
              {/* <!--body--> */}
              <div>
                <div className="flex gap-4">
                  <input
                    type="text"
                    className="p-2 rounded-md border border-gray-300 focus:outline-none  w-full"
                    placeholder="Nom de source"
                    value={this.state.srcName}
                    onChange={(e) => this.setState({ srcName: e.target.value })}
                  />
                  <input
                    type="text"
                    className="p-2 rounded-md border border-gray-300 focus:outline-none  w-full"
                    placeholder="source"
                    value={this.state.src}
                    onChange={(e) => this.setState({ src: e.target.value })}
                  />
                  <button
                    className="bg-blue-800 p-2 rounded-md border-0"
                    onClick={(e) => {
                      e.preventDefault();
                      if (this.state.srcName !== "" && this.state.src !== "") {
                        // this.setState({
                        //   sources: [
                        //     ...this.state.sources,
                        //     {
                        //       name: this.state.srcName,
                        //       src: this.state.src,
                        //     },
                        //   ],
                        //   srcName: "",
                        //   src: "",
                        // });
                        this.addSources();
                      } else {
                        toast.error("Remplissez les champs");
                      }
                    }}
                  >
                    <i className="fa-solid fa-plus text-white text-2xl"></i>
                  </button>
                </div>

                <ul className="space-y-3 mt-8">
                  {this.state.sources.length
                    ? this.state.sources.map((src, key) => (
                        <li
                          className="font-semibold text-sm md:text-md text-wrap text-blue-400 space-x-4"
                          key={key}
                        >
                          <span className="text-sm text-gray-400">
                            {src.name}
                          </span>
                          <span className="text-md text-blue-400">
                            {src.src}
                          </span>
                        </li>
                      ))
                    : null}
                </ul>
              </div>
              {/* <!--footer--> */}
              <div className="p-3  mt-2 text-center space-x-4 md:block">
                <button
                  className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100"
                  onClick={() => this.setState({ showModel: false })}
                >
                  Fermer
                </button>
                {/* <button
                  className="mb-2 md:mb-0 bg-red-500 border border-red-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-red-600"
                  onClick={this.addSources}
                >
                  Ajouter
                </button> */}
              </div>
            </div>
          </div>
        </div>
        {/* Add Sources Modal End */}
      </div>
    );
  }
}
