import axios from "axios";
import React, {Component} from "react";
import UserContext from "../../../Context/UserContext";
import Pagination from "../../../components/Pagination";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {logoutUnAuthenticatedUsers} from "../../../helpers/helpers";
import PostsTableRow from "../../../components/PostsTableRow";
import {emptyTrash, fetchPosts} from "../../../helpers/posts";


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
            trash: false,
        };
    }

    notify = (text) => toast.success(text);


    searchMovies = async (page) => {
        let url;


        if (!this.state.trash) {
            url = "/moderator/posts?type=movie&search=" +
                this.state.search +
                "&page=" +
                page;
        } else {
            url = "/moderator/posts?type=movie&trash=1&search=" +
                this.state.search +
                "&page=" +
                page;
        }

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
        let url;
        if (this.state.searchId !== "") {

            if (!this.state.trash) {
                url = "/moderator/posts?type=movie&id=" +
                    this.state.searchId
            } else {
                url = "/moderator/posts?type=movie&trash=1&id=" +
                    this.state.searchId
            }


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
                    // let arr = [];
                    // arr.push(response.data);
                    await this.setState({
                        movies: response.data.data,
                        currentPage: 1,
                        lastPage: 1,
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    // disapprove movie



    componentDidMount() {
        const {token, role} = this.context;
        this.setState(
            {
                token,
                role,
            },
             () => {
                 fetchPosts(1, token, this.state.trash, 'movie').then(res => {
                     this.setState({
                         movies: res.data,
                         currentPage: res.currentPage,
                         lastPage: res.lastPage
                     });
                 })
            }
        );
    }

    render() {
        return (
            <div className="w-full relative">
                <ToastContainer/>
                <h1 className="text-center text-xl font-bold hidden md:block">Films</h1>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <div className="p-4 flex flex-wrap justify-between items-center gap-4">
                        <div>
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
                                        onKeyUp={e => {
                                            if (e.key == "Enter") {
                                                this.searchMovies(1);
                                            }
                                        }}
                                        onChange={(e) => this.setState({search: e.target.value})}
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
                                        onKeyUp={e => {
                                            if (e.key == "Enter") {
                                                this.searchMoviesId();
                                            }
                                        }}
                                        onChange={(e) => this.setState({searchId: e.target.value})}
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
                        </div>

                        <div className="flex gap-2 flex-wrap">
                            <label className="label cursor-pointer space-x-2">
                                <span className="label-text">Afficher la corbeille</span>
                                <input
                                    type="checkbox"
                                    checked={this.state.trash}
                                    value={this.state.trash}
                                    className="checkbox"
                                    onChange={e => {
                                        this.setState({trash: e.target.checked},  () => {
                                            fetchPosts(1, this.state.token, this.state.trash, 'movie').then(res => {
                                                this.setState({
                                                    movies: res.data,
                                                    currentPage: res.currentPage,
                                                    lastPage: res.lastPage
                                                });
                                            })
                                        });

                                    }}
                                />
                            </label>
                            {
                                this.state.trash ?
                                    (
                                        <button
                                            className="block px-4 py-2 rounded-md bg-red-600 text-white ml:auto"
                                            onClick={() => {
                                                emptyTrash("movie", this.state.token).then(res => {
                                                    fetchPosts(1, this.state.token, this.state.trash, 'movie').then(res => {
                                                        this.setState({
                                                            movies: res.data,
                                                            currentPage: res.currentPage,
                                                            lastPage: res.lastPage
                                                        });
                                                    })
                                                })

                                            }}
                                        >
                                            Vider la poubelle
                                        </button>
                                    )
                                    :
                                    (
                                        <a
                                            href="/moderator/movies/create"
                                            className="block px-4 py-2 rounded-md bg-indigo-600 text-white ml:auto"
                                        >
                                            Ajouter un film
                                        </a>
                                    )
                            }
                        </div>
                    </div>
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead
                            className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                            <PostsTableRow movies={this.state.movies} fetch={() => {
                                fetchPosts(1, this.state.token, this.state.trash, 'movie').then(res => {
                                    this.setState({
                                        movies: res.data,
                                        currentPage: res.currentPage,
                                        lastPage: res.lastPage
                                    });
                                })
                            }}/>
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
                                                : (page) => {
                                                    if (page === 1)
                                                    {
                                                        page = "1";
                                                    }
                                                    fetchPosts(page, this.state.token, this.state.trash, 'movie').then(res => {
                                                        this.setState({
                                                            movies: res.data,
                                                            currentPage: res.currentPage,
                                                            lastPage: res.lastPage
                                                        });
                                                    })
                                                }
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
