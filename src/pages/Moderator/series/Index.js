import { Tfoot } from "@chakra-ui/table";
import axios from "axios";
import React, { Component } from "react";
import UserContext from "../../../Context/UserContext";
import Pagination from "../../../components/Pagination";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default class Index extends Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.state = {
      series: [],
      currentPage: 1,
      lastPage: 1,
      token: "",
      search: "",
      searchId: "",
      role: "",
    };
  }

  notify = (text) => toast.success(text);

  fetchSeries = async (page) => {
    if (page !== 1) {
      window.location.search = "page=" + page;
    }
    let pg = new URLSearchParams(window.location.search).get("page") || 1;
    let url = "/moderator/posts?type=serie&page=" + pg;
    // let currentUrl = window.location.href;

    console.log(pg);
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
          series: response.data.data,
          currentPage: response.data.current_page,
          lastPage: response.data.last_page,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  searchSeries = async (page) => {
    let url =
      "/moderator/posts?type=serie&search=" +
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
          series: response.data.data,
          currentPage: response.data.current_page,
          lastPage: response.data.last_page,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  searchSeriesId = async () => {
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
            series: arr,
            currentPage: 1,
            lastPage: 1,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  deleteSerie = async (id) => {
    await axios({
      url: "/moderator/posts/" + id,
      method: "delete",
      responseType: "json",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + this.state.token,
      },
    })
      .then(async (response) => {
        this.notify(response.data.success);
        await this.fetchSeries(1);
        // console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  addToSlider = async (id) => {
    await axios({
      url: "/moderator/featured/" + id,
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
        if (response.data.message) {
          this.notify(response.data.message);
        } else {
          toast.error(response.data.error);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  componentDidMount() {
    const { token, role } = this.context;
    this.setState(
      {
        token,
        role,
      },
      () => {
        this.fetchSeries(1);
      }
    );
  }
  render() {
    return (
      <div className="w-full">
        <ToastContainer />
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <div className="p-4 flex flex-wrap justify-between items-center gap-4">
            {/* Search By Name */}
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
                  placeholder="Recherche par nom"
                  value={this.state.search}
                  onChange={(e) => this.setState({ search: e.target.value })}
                />
                <button
                  className="p-2 bg-blue-500 text-white font-bold rounded-md"
                  onClick={(e) => {
                    e.preventDefault();
                    this.searchSeries(1);
                  }}
                >
                  Recherche
                </button>
              </div>
            </div>

            {/* End Search By Name */}

            {/* Search By Id */}
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
                  placeholder="Recherche par identifiant"
                  value={this.state.searchId}
                  onChange={(e) => this.setState({ searchId: e.target.value })}
                />
                <button
                  className="p-2 bg-blue-500 text-white font-bold rounded-md"
                  onClick={(e) => {
                    e.preventDefault();
                    this.searchSeriesId();
                  }}
                >
                  Recherche
                </button>
              </div>
            </div>
            {/* END Search By Id */}

            <h1 className="text-center text-xl font-bold hidden md:block">
              Séries
            </h1>

            <a
              href="/moderator/series/create"
              className="block px-4 py-2 rounded-md bg-indigo-600 text-white"
            >
              Ajouter un Série
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
                  <span className="sr-only">Éditer</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {this.state.series.length
                ? this.state.series.map((serie) => (
                    <tr
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      key={serie.id}
                    >
                      <td className="w-4 p-4">
                        <div className="flex items-center">{serie.id}</div>
                      </td>
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                      >
                        {serie.title.split("'").join("'")}
                      </th>
                      <td className="px-6 py-4">{serie.year}</td>
                      <td className="px-6 py-4">{serie.lang}</td>
                      <td className="px-6 py-4 text-right space-x-4">
                        <a
                          href={`/moderator/series/${serie.id}/edit`}
                          className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-3"
                        >
                          Éditer
                        </a>

                        <button
                          className="font-medium text-purple-600 dark:text-blue-500 hover:underline"
                          onClick={() => this.addToSlider(serie.id)}
                        >
                          Ajouter au curseur
                        </button>

                        {/* Display the delete button if admin */}
                        <button
                          className="font-medium text-red-600 dark:text-blue-500 hover:underline"
                          onClick={() => this.deleteSerie(serie.id)}
                        >
                          Supprimer
                        </button>

                        <a
                          href={`/moderator/series/${serie.id}/episodes`}
                          className="font-medium text-teal-500 dark:text-blue-500 hover:underline mr-3"
                        >
                          Episodes
                        </a>
                      </td>
                    </tr>
                  ))
                : null}
            </tbody>

            {this.state.lastPage > 1 ? (
              <tfoot>
                <tr>
                  <th colSpan="5">
                    <Pagination
                      currentPage={this.state.currentPage}
                      lastPage={this.state.lastPage}
                      handleClick={
                        this.state.search !== ""
                          ? this.searchSeries
                          : this.fetchSeries
                      }
                    />
                  </th>
                </tr>
              </tfoot>
            ) : null}
          </table>
        </div>
      </div>
    );
  }
}
