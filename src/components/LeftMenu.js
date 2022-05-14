import React, { useEffect, useState } from "react";
import {
  ImSearch,
  ImPlay,
  ImHome3,
  ImVideoCamera,
  ImSteam2,
} from "react-icons/im";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import axios from "axios";

export default function LeftMenu() {
  const [genre, setGenre] = useState(false);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    if (search === "") {
      return;
    }
    window.location.href = "/search?q=" + search;
  };

  useEffect(() => {
    axios
      .get("http://192.168.3.7:8001/api/categories")
      .then((res) => {
        let data = res.data;
        setCategories(data);
      })
      .catch((err) => console.error(err));

    return () => {
      setCategories([]);
    };
  }, []);

  return (
    <aside className="left-menu space-y-4 leftnav">
      <div className="left-menu-item left-menu-active flex items-center">
        <ImSearch size={24} color="#fff" />
        <input
          type="text"
          placeholder="Rechercher dans le site"
          className="left-menu-item-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyUp={(e) => {
            if (e.keyCode == 13) {
              handleSearch();
            }
          }}
        />
      </div>
      <a href="/" className="left-menu-item block left-menu-active">
        <div className="flex items-center gap-4 p-4">
          <ImHome3 size={24} color="#0260E8" />
          <span className="block text-xl font-medium text-white">
            Page d'accueil
          </span>
        </div>
      </a>
      <a href="/movies" className="left-menu-item block">
        <div className="flex items-center gap-4 p-4">
          <ImPlay size={24} color="#F85C50" />
          <span className="block text-xl font-medium text-white">Films</span>
        </div>
      </a>
      <a href="/series" className="left-menu-item block">
        <div className="flex items-center gap-4 p-4">
          <ImVideoCamera size={24} color="#A771FE" />
          <span className="block text-xl font-medium text-white">Séries</span>
        </div>
      </a>
      <a href="#" className="left-menu-item block">
        <div className="flex items-center gap-4 p-4">
          <ImSteam2 size={24} color="#F59BAF" />
          <span className="block text-xl font-medium text-white">Anime</span>
        </div>
      </a>
      <span className="text-lg font-bold text-gray-100 block">
        Filtres & Personnalisation
      </span>
      <div className="left-menu-item left-menu-active">
        <div
          className="flex justify-between items-center p-3 cursor-pointer"
          onClick={() => setGenre(!genre)}
        >
          <span className="text-xl text-white font-semi-bold block">
            Les Genres
          </span>
          {genre ? (
            <AiFillCaretDown size={24} color="#fff" />
          ) : (
            <AiFillCaretUp size={24} color="#fff" />
          )}
        </div>
      </div>
      <div
        className="grid grid-cols-2 gap-4"
        style={{ display: genre ? "grid" : "none" }}
      >
        {categories.map((cat) => (
          <div key={cat.id}>
            <a href={`/categories/${cat.id}/${cat.slug}`}>
              <span className="block filter-item rounded-md p-2 text-gray-300 font-bold">
                {cat.name}
              </span>
            </a>
          </div>
        ))}
      </div>
    </aside>
  );
}
