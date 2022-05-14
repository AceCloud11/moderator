import axios from "axios";
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Avatar, Badge } from "@chakra-ui/react";

import Pagination from "../components/Pagination";
import UserContext from "../Context/UserContext";
import Comment from "./Comment";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./css/pages.scss";

class Serie extends Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.fetchComments = this.fetchComments.bind(this);
    this.state = {
      serie: [],
      vf: [],
      nonVf: [],
      comments: [],
      comment: "",
      currenPage: 1,
      lastPage: 1,
      token: "",
      episode: "",
      isReportSerie: false,
      serieReportText: "",
      isReportComment: false,
      commentReportText: "",
      commentId: "",
      favorites: [],
      isComment: false,
    };
  }

  notify = (text) => toast.success(text);

  changeFrameSrc() {
    console.log(this.state.vf[0]);
    let frame = document.getElementById("frame");
    let src = this.state.nonVf[0] ? this.state.nonVf[0] : this.state.vf[0];

    frame.src = src;
  }

  fetchComments = async (page) => {
    let url =
      "http://192.168.3.7:8001/api/comments/" +
      this.props.match.params.id +
      "?page=" +
      page;
    await axios
      .get(url)
      .then((res) => {
        // console.log(res.data);
        this.setState({
          comments: res.data.data,
          lastPage: res.data.last_page,
          currenPage: res.data.current_page,
        });
      })
      .catch((err) => {
        throw err;
      });
  };

  updateState = (isRep, id) => {
    this.setState({
      isReportComment: isRep,
      commentId: id,
    });
  };

  addComment = async (e) => {
    e.preventDefault();
    let url = `/comments/${this.state.serie.id}`;
    await axios({
      method: "post",
      url,
      data: {
        text: this.state.comment,
      },
      responseType: "json",
      headers: {
        Authorization: `Bearer ${this.state.token}`,
        Accept: "application/json",
        "Content-type": "application/json",
      },
    })
      .then(async (res) => {
        console.log(res.data);
        await this.fetchComments(1);
        await this.setState({
          comment: "",
          isComment: false,
        });
        this.notify(res.data.message);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  likeComment = async (commentId) => {
    await axios({
      url: "/like/" + commentId,
      method: "post",
      responseType: "json",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + this.state.token,
      },
    })
      .then((res) => {
        this.fetchSerie();
        this.notify(res.data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  dislikeComment = async (commentId) => {
    await axios({
      url: "/dislike/" + commentId,
      method: "post",
      responseType: "json",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + this.state.token,
      },
    })
      .then((res) => {
        // console.log(res.data);
        this.fetchSerie();
        this.notify(res.data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  fetchSerie = async () => {
    let url = "http://192.168.3.7:8001/api/posts/" + this.props.match.params.id;
    await axios
      .get(url)
      .then((res) => {
        let data = res.data;
        // data.img = "https://wiflix.biz/wfimages/" + data.img;
        // console.log(data.episodes.vf);
        // console.log(Object.entries(data.episodes.vf));
        // console.log(
        //   Object.entries(Object.entries(data.episodes.vf)[data.latest_ep - 1 ])[1][1]
        //     .sources
        // );
        // console.log(Object.keys(data.episodes.vf).length);

        this.setState({
          serie: data,
          vf: Object.keys(data.episodes.vf).length
            ? Object.entries(
                Object.entries(data.episodes.vf)[data.latest_ep - 1]
              )[1][1].sources
            : [],
          nonVf:
            Object.keys(data.episodes.nonVf).length !== 0
              ? Object.entries(
                  Object.entries(data.episodes.nonVf)[data.latest_ep - 1]
                )[1][1].sources
              : [],
          // comments: data.comments.data,
          // currenPage: data.comments.current_page,
          // lastPage: data.comments.last_page,
          episode: data.latest_ep,
        });

        this.changeFrameSrc();
      })
      .catch((err) => {
        throw err;
      });
  };

  reportSerie = async (postId) => {
    if (this.state.movieReportText !== "" && postId !== undefined) {
      await axios({
        url: "/reports/posts/" + postId,
        method: "POST",
        responseType: "json",
        data: {
          text: this.state.serieReportText,
        },
        headers: {
          Authorization: "Bearer " + this.state.token,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          // console.log(res.data);
          this.setState({
            serieReportText: "",
            isReportSerie: false,
          });
          if (res.data.message) {
            this.notify(res.data.message);
          } else {
            toast.error(res.data.error);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  reportComment = async () => {
    if (this.state.commentId !== "" && this.state.commentReportText !== "") {
      await axios({
        url: "/reports/comments/" + this.state.commentId,
        method: "POST",
        responseType: "json",
        data: {
          text: this.state.commentReportText,
        },
        headers: {
          Authorization: "Bearer " + this.state.token,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          // console.log(res.data);
          this.setState({
            commentId: "",
            commentReportText: "",
            isReportComment: false,
          });
          this.notify(res.data.message);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  fetchFavs = () => {
    if (this.state.token) {
      axios
        .get("/favourites", {
          responseType: "json",
          headers: {
            Authorization: `Bearer ${this.state.token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then(async (res) => {
          const favs = res.data.data.map((el) => el.id);

          await this.setState({
            favorites: favs,
          });
        })
        .catch(console.error);
    }
  };

  addToFav = async () => {
    await axios({
      url: "/favourites/" + this.state.serie.id,
      method: "post",
      responseType: "json",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + this.state.token,
      },
    })
      .then((res) => {
        // console.log(res.data);
        this.setState({
          isFav: true,
        });
        this.fetchFavs();
        this.notify(res.data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  removeFromFav = async (favid) => {
    let url = `/favourites/${favid}`;
    await axios({
      method: "delete",
      url,
      responseType: "json",
      headers: {
        Authorization: `Bearer ${this.state.token}`,
        Accept: "application/json",
        "Content-type": "application/json",
      },
    })
      .then(async (res) => {
        await this.fetchFavs();
        this.notify(res.data.message);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  componentDidMount() {
    const { token } = this.context;
    this.setState(
      {
        token: token,
      },
      () => this.fetchFavs()
    );

    this.fetchSerie();
    this.fetchComments();
  }

  render() {
    return (
      <div className="mt-16 md:mt-0">
        <ToastContainer />
        <section className="m-8 space-y-8">
          <div className="flex gap-4 flex-col md:flex-row relative">
            <img
              src={this.state.serie.img}
              alt=""
              // style={{ maxHeight: 350, maxWidth: 450 }}
              className="post-image"
            />
            <div className="">
              <p className="text-white text-xl font-bold">
                {this.state.serie.title} - Episode {this.state.episode}
              </p>
              <hr className="text-gray-200 my-4" />
              <ul className="space-y-4">
                <li className="flex gap-8 items-center">
                  <p className="font-bold text-lg" style={{ color: "#b9bfef" }}>
                    Durée
                  </p>
                  <p className="text-white text-lg">
                    {this.state.serie.duration}
                  </p>
                </li>
                <li className="flex gap-8 items-center">
                  <p className="font-bold text-lg" style={{ color: "#b9bfef" }}>
                    Année de sortie
                  </p>
                  <p className="text-white text-lg">{this.state.serie.year}</p>
                </li>

                <li className="flex gap-8 items-center flex-wrap">
                  <p className="font-bold text-lg" style={{ color: "#b9bfef" }}>
                    Categorie
                  </p>
                  {this.state.serie.categories
                    ? this.state.serie.categories.map((cat) => (
                        <p className="text-white text-lg" key={cat.id}>
                          <a
                            href={`/categories/${cat.id}/${cat.slug}`}
                            className="text-indigo-500"
                          >
                            {cat.name}
                          </a>
                        </p>
                      ))
                    : null}
                </li>
                <li className="flex gap-8 items-center">
                  <p className="font-bold text-lg" style={{ color: "#b9bfef" }}>
                    Qualité
                  </p>
                  <p className="text-white text-lg">
                    {this.state.serie.quality}
                  </p>
                </li>
                <li className="flex gap-8 items-center">
                  <p className="font-bold text-lg" style={{ color: "#b9bfef" }}>
                    Langue
                  </p>
                  <p className="text-white text-lg">{this.state.serie.lang}</p>
                </li>
                <li className="flex gap-8 items-center">
                  <p
                    className="font-bold text-lg flex flex-wrap gap-3"
                    style={{ color: "#b9bfef" }}
                  >
                    Directeurs
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {this.state.serie.directors
                      ? this.state.serie.directors.map((dir) => (
                          <p className="text-white text-lg" key={dir.id}>
                            {dir.name}
                          </p>
                        ))
                      : "Aucun directeur"}
                  </div>
                </li>
                <li className="flex gap-8 items-center">
                  <p className="font-bold text-lg" style={{ color: "#b9bfef" }}>
                    Acteurs
                  </p>
                  <p className="text-white text-lg flex flex-wrap gap-3">
                    {this.state.serie.actors
                      ? this.state.serie.actors.map((actor) => (
                          <div>
                            <a
                              href={`/actor/${actor.id}/${actor.name
                                .split(" ")
                                .join("-")}`}
                              className="text-indigo-400 font-bold hover:text-indigo-200"
                              key={actor.id}
                            >
                              {actor.name}
                            </a>
                          </div>
                        ))
                      : "Aucun Acteur"}
                  </p>
                </li>
              </ul>
            </div>
          </div>

          <div
            className="p-4 rounded-md space-y-4"
            style={{ backgroundColor: "#30365aa4" }}
          >
            <h3 className="text-2xl text-white ">l'histoire du film</h3>
            <p className="text-gray-400 text-sm">
              {this.state.serie.description
                ? this.state.serie.description
                : "Pas de description"}
            </p>
          </div>

          {/* Add Movie To Favs */}
          {this.state.favorites.length ? (
            this.state.favorites.includes(this.state.serie.id) ? null : (
              <div className="my-12 space-y-4">
                <button
                  title="Ajouter aux Favoris"
                  className="bg-red-500 p-2 rounded-md text-white"
                  onClick={(e) => {
                    if (this.state.token) {
                      this.addToFav();
                    } else {
                      window.location.href = "/login";
                    }
                  }}
                >
                  Ajouter aux Favoris
                  <i className="fa-solid fa-heart text-white text-xl pl-4"></i>
                </button>
              </div>
            )
          ) : (
            <div className="my-12 space-y-4">
              <button
                title="Ajouter aux Favoris"
                className="bg-red-500 p-2 rounded-md text-white"
                onClick={(e) => {
                  if (this.state.token) {
                    this.addToFav();
                  } else {
                    window.location.href = "/login";
                  }
                }}
              >
                Ajouter aux Favoris
                <i className="fa-solid fa-heart text-white text-xl pl-4"></i>
              </button>
            </div>
          )}

          {/* End Add Movie To Favs */}

          <article className="text-center space-y-12">
            <article className="flex flex-col gap-4 justify-start">
              <span
                className="block text-center px-4 py-2 rounded-md text-white font-bold"
                style={{ backgroundColor: "#0043a4" }}
              >
                VF
              </span>
              <div className="bg-white p-4 rounded-md flex flex-wrap gap-4">
                {this.state.serie.episodes
                  ? this.state.serie.episodes.vf
                    ? Object.keys(this.state.serie.episodes.vf).map(
                        (key, index) => (
                          <div key={key}>
                            <button
                              className="block rounded-md px-4 py-2 text-gray-300 font-bold"
                              style={{ backgroundColor: "#30365aa4" }}
                              onClick={() => {
                                // console.log(this.state.serie.episodes.vf[key].sources);
                                this.setState(
                                  {
                                    vf: this.state.serie.episodes.vf.length
                                      ? this.state.serie.episodes.vf[key]
                                          .sources
                                      : [],
                                    nonVf: this.state.serie.episodes.nonVf
                                      .length
                                      ? this.state.serie.episodes.nonVf[key]
                                          .sources
                                      : [],
                                    episode: key,
                                  },
                                  () => this.changeFrameSrc()
                                );
                              }}
                            >
                              {key < 10 ? "Episode 0" + key : `Episode ${key}`}
                            </button>
                          </div>
                        )
                      )
                    : null
                  : null}
              </div>

              <span
                className="block text-center px-4 py-2 rounded-md text-white font-bold"
                style={{ backgroundColor: "#0043a4" }}
              >
                VOSTFR
              </span>

              <div className="bg-white p-4 rounded-md flex flex-wrap gap-4">
                {this.state.serie.episodes
                  ? this.state.serie.episodes.nonVf
                    ? Object.keys(this.state.serie.episodes.nonVf).map(
                        (key, index) => (
                          <div key={key}>
                            <button
                              onClick={() => {
                                this.setState(
                                  {
                                    nonVf: this.state.serie.episodes.nonVf
                                      .length
                                      ? this.state.serie.episodes.nonVf[key]
                                          .sources
                                      : [],
                                    vf: this.state.serie.episodes.vf.length
                                      ? this.state.serie.episodes.vf[key]
                                          .sources
                                      : [],
                                    episode: key,
                                  },
                                  () => this.changeFrameSrc()
                                );
                              }}
                              className="block rounded-md px-4 py-2 text-gray-300 font-bold"
                              style={{ backgroundColor: "#30365aa4" }}
                            >
                              {key < 10 ? "Episode 0" + key : `Episode ${key}`}
                            </button>
                          </div>
                        )
                      )
                    : null
                  : null}
              </div>
            </article>

            <h1 className="text-white font-bold text-2xl">Serveurs</h1>

            <article className="grid grid-cols-1 xl:grid-cols-4 gap-4">
              <ul className="space-y-2" id="serveurs-list">
                {this.state.vf.length ? (
                  <li className="py-4 px-4 text-center rounded-md text-white w-full text-blue-500 text-2xl font-bold">
                    Serveurs Vf
                  </li>
                ) : null}
                {this.state.vf
                  ? Object.keys(this.state.vf).map((key, index) => (
                      <li key={key}>
                        <button
                          className="py-4 px-4 rounded-md text-white w-full serveurl-link"
                          style={{ backgroundColor: "#30365aa4" }}
                          onClick={(e) => {
                            let frame = document.getElementById("frame");
                            frame.src = this.state.vf[key];
                            let links =
                              document.querySelectorAll(".serveurl-link");
                            let el = e.target;

                            links.forEach((link) => {
                              link.style.backgroundColor = "#30365aa4";
                            });
                            el.style.backgroundColor = "#3498db";
                          }}
                        >
                          Lecteur {index + 1}
                        </button>
                      </li>
                    ))
                  : null}
                {this.state.nonVf.length ? (
                  <li className="py-4 px-4 text-center rounded-md text-white w-full text-blue-500 text-2xl font-bold">
                    Serveurs VOSTFR
                  </li>
                ) : null}
                {this.state.nonVf
                  ? Object.keys(this.state.nonVf).map((key, index) => (
                      <li key={key}>
                        <button
                          className="py-4 px-4 rounded-md text-white w-full serveurl-link"
                          style={{ backgroundColor: "#30365aa4" }}
                          onClick={(e) => {
                            let frame = document.getElementById("frame");
                            frame.src = this.state.nonVf[key];
                            let links =
                              document.querySelectorAll(".serveurl-link");
                            let el = e.target;

                            links.forEach((link) => {
                              link.style.backgroundColor = "#30365aa4";
                            });
                            el.style.backgroundColor = "#3498db";
                          }}
                        >
                          Lecteur {index + 1}
                        </button>
                      </li>
                    ))
                  : null}
              </ul>
              <div className="xl:col-span-3">
                <iframe
                  id="frame"
                  src=""
                  style={{ minHeight: 500 }}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full rounded-md border-2 text-white frame"
                />
              </div>
            </article>
          </article>
        </section>

        {/* Report Serie */}

        <div className="mx-12 my-12 space-y-4">
          <button
            title="report Serie"
            className="bg-pink-700 p-2 rounded-md text-white"
            onClick={(e) => {
              if (this.state.token) {
                this.setState({ isReportSerie: !this.state.isReportSerie });
              } else {
                window.location.href = "/login";
              }
            }}
          >
            Signaler un problème
            <i className="fa-solid fa-flag text-white text-xl pl-4"></i>
          </button>

          <div
            style={{ display: this.state.isReportSerie ? "block" : "none" }}
            className="space-y-4"
          >
            <textarea
              rows="4"
              placeholder="raconte nous ton problème"
              value={this.state.serieReportText}
              onChange={(e) =>
                this.setState({ serieReportText: e.target.value })
              }
              className="w-full rounded-md border-2 border-gray-300 bg-transparent placeholder:text-gray-500 p-3 placeholder:font-semibold text-gray-400 font-semibold"
            ></textarea>
            <button
              title="report Serie"
              className="bg-pink-700 p-2 rounded-md text-white"
              onClick={(e) => {
                e.preventDefault();
                this.reportSerie(this.state.serie.id);
              }}
            >
              Envoyer un rapport
            </button>
          </div>
        </div>

        {/* End Report Serie */}

        {/* Comment section */}
        <section className="mx-8 md:mx-12 lg:mx-24 xl:mx-32 py-24 space-y-4">
          <div className="flex justify-end">
            <button
              className="bg-blue-900 text-white font-bold py-4 px-4 rounded-md"
              onClick={() => {
                if (this.state.token) {
                  this.setState({ isComment: true });
                } else {
                  window.location.href = "/login";
                }
              }}
            >
              Ajouter un commentaire
            </button>
          </div>

          <section className="space-y-4">
            {this.state.comments
              ? this.state.comments.map((com) => (
                  <Comment
                    com={com}
                    likeComment={this.likeComment}
                    dislikeComment={this.dislikeComment}
                    updateState={this.updateState}
                  />
                ))
              : null}
            {this.state.lastPage !== 1 ? (
              <Pagination
                handleClick={this.fetchComments}
                currentPage={this.state.currenPage}
                lastPage={this.state.lastPage}
              />
            ) : null}
          </section>
        </section>

        {/* End Comment Section */}

        {/* Report Comment Modal Start */}
        <div
          className="min-w-screen h-screen animated fadeIn faster  fixed  left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover"
          id="modal-id"
          style={{ display: this.state.isReportComment ? "flex" : "none" }}
        >
          <div className="absolute bg-black opacity-80 inset-0 z-0"></div>
          <div className="w-full  max-w-lg p-5 relative mx-auto my-auto rounded-xl shadow-lg  bg-white ">
            {/* <!--content--> */}
            <div className="">
              {/* <!--body--> */}
              <div className="text-center p-5 flex-auto justify-center">
                <textarea
                  autoFocus
                  rows="10"
                  className="border-2 border-gray-400 rounded-md p-3 w-full"
                  value={this.state.commentReportText}
                  onChange={(e) =>
                    this.setState({ commentReportText: e.target.value })
                  }
                ></textarea>
              </div>
              {/* <!--footer--> */}
              <div className="p-3  mt-2 text-center space-x-4 md:block">
                <button
                  className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100"
                  onClick={() => this.setState({ isReportComment: false })}
                >
                  Cancel
                </button>
                <button
                  className="mb-2 md:mb-0 bg-red-500 border border-red-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-red-600"
                  onClick={this.reportComment}
                >
                  Send Report
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Report Comment Modal End */}

        {/* Add Comment Modal Start */}
        <div
          className="min-w-screen h-screen animated fadeIn faster  fixed  left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover"
          id="modal-id"
          style={{ display: this.state.isComment ? "flex" : "none" }}
        >
          <div className="absolute bg-black opacity-80 inset-0 z-0"></div>
          <div className="w-full  max-w-lg p-5 relative mx-auto my-auto rounded-xl shadow-lg  bg-white ">
            {/* <!--content--> */}
            <div className="">
              {/* <!--body--> */}
              <div className="text-center p-5 flex-auto justify-center">
                <textarea
                  name=""
                  id=""
                  rows="10"
                  className="border-2 border-gray-400 rounded-md p-3 w-full"
                  value={this.state.comment}
                  onChange={(e) => this.setState({ comment: e.target.value })}
                ></textarea>
              </div>
              {/* <!--footer--> */}
              <div className="p-3  mt-2 text-center space-x-4 md:block">
                <button
                  className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100"
                  onClick={() => this.setState({ isComment: false })}
                >
                  Fermer
                </button>
                <button
                  className="mb-2 md:mb-0 bg-red-500 border border-red-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-red-600"
                  onClick={this.addComment}
                >
                  Commenter
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Add Comment Modal End */}
      </div>
    );
  }
}

export default withRouter(Serie);
