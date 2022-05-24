import React, { useContext, useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import IndexCategories from "./categories/IndexCategories";
import IndexComments from "./comments/IndexComments";
import Create from "./movies/Create";
import Edit from "./movies/Edit";
import IndexMovies from "./movies/IndexMovies";
import IndexReports from "./reports/IndexReports";

import CreateSerie from "./series/Create";
import CreateEpisode from "./series/CreateEpisode";
import Episodes from "./series/Episodes";
import EditSerie from "./series/Edit";
import Index from "./Index";
import IndexSeries from "./series/Index";
import Chat from "./chat/Chat";

import './moderator.css';
import UserContext from "../../Context/UserContext";
import IndexActor from "./actor/IndexActor";
import IndexDirector from "./director/IndexDirector";
import IndexSlider from "./slider/IndexSlider";
import axios from "axios";
import Sources from "./movies/Sources";
import Banners from "./banner/Banners";
import Cookies from "js-cookie";
import Profile from "./profile/Profile";

import './moderator.css';

export default function Dashboard() {
  
  const { role, token } = useContext(UserContext);
  const [url, setUrl] = useState('');
  

  const logout = () => {
    // localStorage.removeItem("role");
    // localStorage.removeItem("token");
    Cookies.remove("token");
    Cookies.remove("role");

   
    window.location.href = "/";
  };

  useEffect(() => {
     setUrl(document.location.href.split("moderator")[1]);
  })
  

  return (
    <div className="">
      <header>
        <nav
          aria-label="menu nav"
          className="bg-gray-800 pt-2 md:pt-1 pb-1 px-1 mt-0 h-auto fixed w-full z-20 top-0"
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-shrink md:w-1/3 justify-center md:justify-start text-white">
              <a href="/" aria-label="Home" className="w-32 pl-8">
                <img src="/wiflix.png" alt="" />
              </a>
            </div>

            <div className="flex w-full pt-2 content-center justify-between md:w-1/3 md:justify-end">
              <ul className="list-reset flex justify-end flex-1 md:flex-none items-center">
                <li className="md:flex-none md:mr-3">
                  <div className="relative inline-block" id="moderator_user">
                    <button className="drop-button text-white py-2 px-2">
                      <span className="pr-2"></span> Salut{" "}
                      {role === "admin" ? "Admin" : "Modérateur"}
                      <svg
                        className="h-3 fill-current inline"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </button>
                    <div
                      id="myDropdown"
                      className="absolute bg-gray-800 text-white right-0 w-60  p-3 overflow-auto z-30 hidden"
                    >
                      <a
                        href="/moderator/profile"
                        className="p-2 hover:bg-gray-800 text-white text-sm no-underline hover:no-underline block w-100"
                      >
                        <i className="fa fa-user fa-fw"></i> Profil
                      </a>

                      <button
                        onClick={logout}
                        className="p-2 hover:bg-gray-800 text-white text-sm no-underline hover:no-underline block w-100"
                      >
                        <i className="fa-solid fa-right-from-bracket fa-fw"></i>{" "}
                        Se déconnecter
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <div className="flex flex-col md:flex-row bg-gray-800 ">
        <nav className="alternative nav pt-12 bg-gray-800">
          <div className="bg-gray-800 shadow-xl h-20 fixed bottom-0 mt-20 md:relative md:h-screen z-10 w-full md:w-60 content-center overflow-scroll no-scrollbar">
            <div className="md:mt-12 md:w-60 md:fixed md:left-0 md:top-0 content-center md:content-start text-left justify-between">
              <ul
                className="list-reset flex flex-row md:flex-col pt-3 md:py-3 px-1 md:px-2 text-center md:text-left"
                id="menu-dash"
              >
                <li className={`mr-3 flex-1 ${url == "" ? "active" : ""}`}>
                  <a
                    href="/moderator"
                    className=" block py-1 md:py-3 pl-1 align-middle text-white no-underline hover:text-white hover:border-b-2 hover:border-blue-600"
                  >
                    <i className="fas fa-gauge-high pr-0 md:pr-3"></i>
                    <span className="pb-1 md:pb-0 text-xs md:text-base text-gray-400 md:text-gray-200 block md:inline-block">
                      Tableau de bord
                    </span>
                  </a>
                </li>
                <li
                  className={`mr-3 flex-1 ${
                    url.includes("movies") ? "active" : ""
                  }`}
                >
                  <a
                    href="/moderator/movies"
                    className="block py-1 md:py-3 pl-1 align-middle text-white no-underline hover:text-white hover:border-b-2  hover:border-blue-600"
                  >
                    <i className="fas fa-film pr-0 md:pr-3"></i>
                    <span className="pb-1 md:pb-0 text-xs md:text-base text-gray-400 md:text-gray-200 block md:inline-block">
                      Films
                    </span>
                  </a>
                </li>
                <li
                  className={`mr-3 flex-1 ${
                    url.includes("categories") ? "active" : ""
                  }`}
                >
                  <a
                    href="/moderator/categories"
                    className="block py-1 md:py-3 pl-1 align-middle text-white no-underline hover:text-white  hover:border-b-2 hover:border-blue-600"
                  >
                    <i className="fa-solid fa-network-wired pr-0 md:pr-3"></i>
                    <span className="pb-1 md:pb-0 text-xs md:text-base text-gray-400 md:text-gray-200 block md:inline-block">
                      Catégories
                    </span>
                  </a>
                </li>
                <li
                  className={`mr-3 flex-1 ${
                    url.includes("series") ? "active" : ""
                  }`}
                >
                  <a
                    href="/moderator/series"
                    className="block py-1 md:py-3 pl-1 align-middle text-white no-underline hover:text-white hover:border-b-2 hover:border-blue-600"
                  >
                    <i className="fas fa-tv pr-0 md:pr-3"></i>
                    <span className="pb-1 md:pb-0 text-xs md:text-base text-white md:text-white block md:inline-block">
                      Séries
                    </span>
                  </a>
                </li>
                <li
                  className={`mr-3 flex-1 ${
                    url.includes("actors") ? "active" : ""
                  }`}
                >
                  <a
                    href="/moderator/actors"
                    className="block py-1 md:py-3 pl-1 align-middle text-white no-underline hover:text-white hover:border-b-2 hover:border-blue-600"
                  >
                    <i className="fas fa-users pr-0 md:pr-3"></i>
                    <span className="pb-1 md:pb-0 text-xs md:text-base text-white md:text-white block md:inline-block">
                      Acteurs
                    </span>
                  </a>
                </li>
                <li
                  className={`mr-3 flex-1 ${
                    url.includes("directors") ? "active" : ""
                  }`}
                >
                  <a
                    href="/moderator/directors"
                    className="block py-1 md:py-3 pl-1 align-middle text-white no-underline hover:text-white hover:border-b-2 hover:border-blue-600"
                  >
                    <i className="fas fa-users pr-0 md:pr-3"></i>
                    <span className="pb-1 md:pb-0 text-xs md:text-base text-white md:text-white block md:inline-block">
                      Directeurs
                    </span>
                  </a>
                </li>
                <li
                  className={`mr-3 flex-1 ${
                    url.includes("comments") ? "active" : ""
                  }`}
                >
                  <a
                    href="/moderator/comments"
                    className="block py-1 md:py-3 pl-0 md:pl-1 align-middle text-white no-underline hover:border-b-2 hover:border-blue-600"
                  >
                    <i className="fa fa-comments pr-0 md:pr-3"></i>
                    <span className="pb-1 md:pb-0 text-xs md:text-base text-gray-400 md:text-gray-200 block md:inline-block">
                      Commentaires
                    </span>
                  </a>
                </li>

                <li
                  className={`mr-3 flex-1 ${
                    url.includes("reports") ? "active" : ""
                  }`}
                >
                  <a
                    href="/moderator/reports"
                    className="block py-1 md:py-3 pl-0 md:pl-1 align-middle text-white no-underline hover:border-b-2 hover:border-blue-600"
                  >
                    <i className="fa fa-bug pr-0 md:pr-3"></i>
                    <span className="pb-1 md:pb-0 text-xs md:text-base text-gray-400 md:text-gray-200 block md:inline-block">
                      Rapports
                    </span>
                  </a>
                </li>

                {/* Slides Link */}
                <li
                  className={`mr-3 flex-1 ${
                    url.includes("slider") ? "active" : ""
                  }`}
                >
                  <a
                    href="/moderator/slider"
                    className="block py-1 md:py-3 pl-0 md:pl-1 align-middle text-white no-underline hover:border-b-2 hover:border-blue-600"
                  >
                    <i className="fa fa-sliders pr-0 md:pr-3"></i>
                    <span className="pb-1 md:pb-0 text-xs md:text-base text-gray-400 md:text-gray-200 block md:inline-block">
                      En vedette
                    </span>
                  </a>
                </li>

                {/* Banners Link */}
                <li
                  className={`mr-3 flex-1 ${
                    url.includes("banners") ? "active" : ""
                  }`}
                >
                  <a
                    href="/moderator/banners"
                    className="block py-1 md:py-3 pl-0 md:pl-1 align-middle text-white no-underline hover:border-b-2 hover:border-blue-600"
                  >
                    <i className="fa fa-rss pr-0 md:pr-3"></i>
                    <span className="pb-1 md:pb-0 text-xs md:text-base text-gray-400 md:text-gray-200 block md:inline-block">
                      Bannières
                    </span>
                  </a>
                </li>

                {/* Chat Link */}
                <li
                  className={`mr-3 flex-1 ${
                    url.includes("chat") ? "active" : ""
                  }`}
                >
                  <a
                    href="/moderator/chat"
                    className="block py-1 md:py-3 pl-0 md:pl-1 align-middle text-white no-underline hover:border-b-2 hover:border-blue-600"
                  >
                    <i className="fa fa-message pr-0 md:pr-3"></i>
                    <span className="pb-1 md:pb-0 text-xs md:text-base text-gray-400 md:text-gray-200 block md:inline-block">
                      Discuter
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <section className="w-full py-28 px-8 bg-white container mx-auto">
          <Switch>
            {/* Movies Routes */}
            <Route exact path="/moderator/movies">
              <IndexMovies />
            </Route>
            <Route path="/moderator/movies/create">
              <Create />
            </Route>
            <Route path={`/moderator/movies/:id/edit`}>
              <Edit />
            </Route>
            <Route path={`/moderator/movies/:id/sources`}>
              <Sources />
            </Route>

            {/* Series Routes */}
            <Route exact path="/moderator/series">
              <IndexSeries />
            </Route>
            <Route path="/moderator/series/create">
              <CreateSerie />
            </Route>
            <Route path={`/moderator/series/:serieId/episodes`}>
              <Episodes />
            </Route>
            <Route path={`/moderator/series/:serieId/episode/create`}>
              <CreateEpisode />
            </Route>
            <Route path={`/moderator/series/:id/edit`}>
              <EditSerie />
            </Route>

            {/* Categories Routes */}
            <Route path="/moderator/categories">
              <IndexCategories />
            </Route>

            {/* Categories Routes */}
            <Route path="/moderator/actors">
              <IndexActor />
            </Route>

            {/* Categories Routes */}
            <Route path="/moderator/directors">
              <IndexDirector />
            </Route>

            {/* Comments Routes */}
            <Route path="/moderator/comments">
              <IndexComments />
            </Route>

            {/* Reports Routes */}
            <Route path="/moderator/reports">
              <IndexReports />
            </Route>

            {/* Chat Routes */}
            <Route path="/moderator/chat">
              <Chat />
            </Route>

            {/* Slider Routes */}
            <Route path="/moderator/slider">
              <IndexSlider />
            </Route>

            {/* Banners Routes */}
            <Route path="/moderator/banners">
              <Banners />
            </Route>

            <Route exact path="/moderator/profile">
              <Profile />
            </Route>

            <Route exact path="/moderator">
              <Index />
            </Route>
          </Switch>
        </section>
      </div>
    </div>
  );
}
