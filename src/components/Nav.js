import React, { useContext } from "react";
import "./css/nav.scss";
import { ImEqualizer, ImCross } from "react-icons/im";
import UserContext from "../Context/UserContext";

export default function Nav({ handleMenuClick, menuState }) {
  const menu = menuState ? (
    <ImCross size={24} color="#fff" onClick={handleMenuClick} />
  ) : (
    <ImEqualizer size={24} color="#fff" onClick={handleMenuClick} />
  );

  const user = useContext(UserContext);

  // console.log(user);

  return (
    <div className="navbar text-white flex justify-between items-center">
      <a href="/" className=" w-28 items-center hidden md:flex">
        <h1>Logo</h1>
      </a>

      <ul className="flex gap-4 ">
        <li className="md:hidden">
          <a href="/">Accueil</a>
        </li>
        <li>
          <a href="/movies">Films</a>
        </li>
        <li>
          <a href="/series">Séries</a>
        </li>
        {user.token ? (
          user.role === "admin" || user.role === "moderator" ? (
            <li>
              <a href="/moderator">Tableau de bord</a>
            </li>
          ) : (
            <li>
              <a href="/profile">Profile</a>
            </li>
          )
        ) : (
          <li>
            <a href="/login">Login</a>
          </li>
        )}

        {/* <li className="block md:hidden">{menu}</li> */}
      </ul>

      <div className="block md:hidden">{menu}</div>
    </div>
  );
}
