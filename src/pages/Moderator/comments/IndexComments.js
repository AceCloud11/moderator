import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Pagination from "../../../components/Pagination";
import UserContext from "../../../Context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function IndexComments() {
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [fil, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState();

  const { token } = useContext(UserContext);

  const notify = (text) => toast.success(text);

  const fetchComments = async (page) => {
    if (page !== 1) {
      window.location.search = "page=" + page;
    }
    let pg = new URLSearchParams(window.location.search).get("page") || 1;

    setPage(page);
    let url = "";
    if (fil) {
      url = "/moderator/comments?is_approved=" + fil + "&page=";
    } else {
      url = "/moderator/comments?page=";
    }
    await axios({
      url: url + pg,
      method: "GET",
      responseType: "json",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        // console.log(res.data.data);
        setComments(res.data.data);
        setCurrentPage(res.data.current_page);
        setLastPage(res.data.last_page);
        // console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const approve = async (id) => {
    await axios({
      url: "/moderator/comments/approve/" + id,
      method: "put",
      responseType: "json",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        fetchComments(page);
        notify(res.data.message);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const filter = async (value) => {
    // console.log("/moderator/comments?is_approved=" + value);
    let url = "";
    if (value == 2) {
      url = "/moderator/comments";
    } else {
      url = "/moderator/comments?is_approved=" + value;
    }
    await axios({
      url,
      method: "get",
      responseType: "json",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        // console.log(res.data);
        setComments(res.data.data);
        setLastPage(res.data.last_page);
        setCurrentPage(res.data.current_page);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const disapprove = async (id) => {
    await axios({
      url: "/moderator/comments/disapprove/" + id,
      method: "put",
      responseType: "json",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        fetchComments(page);
        notify(res.data.message);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const deleteComment = async (id) => {
    await axios({
      url: "/moderator/comments/" + id,
      method: "delete",
      responseType: "json",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        fetchComments(page);
        notify(res.data.message);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const searchComments = async (id) => {
    const num = parseInt(id);
    if (isNaN(num)) {
      alert("Seuls les entiers sont autorisés!");
      setSearch('');
      return;
    }
    await axios({
      url: "/moderator/comments/" + id,
      method: "get",
      responseType: "json",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        // console.log(res.data);
        let arr = [];
        arr.push(res.data);
        setComments(arr);
        setSearch("");
        setCurrentPage(1);
        setLastPage(1);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(async () => {
    // await setToken(token);

    fetchComments(1);

    // console.log(comments);
    return () => {};
  }, []);

  return (
    <div className="w-full">
      <ToastContainer />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="p-4 flex flex-wrap justify-between items-center gap-4">
          {/* Begin search */}
          <label className="sr-only">Search</label>
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                className="p-2 bg-blue-500 text-white font-bold rounded-md"
                onClick={(e) => {
                  e.preventDefault();
                  searchComments(search);
                }}
              >
                Recherche
              </button>
            </div>
          </div>

          {/* End Search */}
          <h1 className="text-center text-xl font-bold hidden md:block">
            Commentaires
          </h1>

          <select
            name=""
            id=""
            className="p-2 rounded-md border-2 border-gray-300"
            onClick={(e) => {
              e.preventDefault();
              setFilter(e.target.value);
              filter(e.target.value);
            }}
          >
            <option disabled selected>
              Filtre
            </option>
            <option value="2">Tout</option>
            <option value="1">A approuvé</option>
            <option value="0">Refusé</option>
          </select>
        </div>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  ID
                  <label className="sr-only">checkbox</label>
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                Text du commentaire
              </th>
              <th scope="col" className="px-6 py-3">
                Nom d'utilisateur
              </th>

              <th scope="col" className="px-6 py-3 text-center">
                <span>Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {comments.length
              ? comments.map((comment) => (
                  <tr
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    key={comment.id}
                  >
                    <td className="w-4 p-4">
                      <div className="flex items-center">
                        {comment.id}
                        <label className="sr-only">checkbox</label>
                      </div>
                    </td>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 dark:text-white"
                    >
                      <p
                        className=" p-4"
                        dangerouslySetInnerHTML={{ __html: comment.text }}
                      ></p>
                    </th>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 dark:text-white"
                    >
                      <p className=" p-4">{comment.username}</p>
                    </th>

                    <td className="px-6 py-4 text-center">
                      {comment.is_approved == 1 ? (
                        <button
                          className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-3"
                          onClick={(e) => {
                            e.preventDefault();
                            disapprove(comment.id);
                          }}
                        >
                          Disapprove
                        </button>
                      ) : (
                        <button
                          className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-3"
                          onClick={(e) => {
                            e.preventDefault();
                            approve(comment.id);
                          }}
                        >
                          Approve
                        </button>
                      )}
                      <button
                        className="font-medium text-red-600 dark:text-blue-500 hover:underline mr-3"
                        onClick={(e) => {
                          e.preventDefault();
                          deleteComment(comment.id);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
          {lastPage > 1 ? (
            <tfoot>
              <tr>
                <th colSpan="4">
                  <Pagination
                    currentPage={currentPage}
                    lastPage={lastPage}
                    handleClick={fetchComments}
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
