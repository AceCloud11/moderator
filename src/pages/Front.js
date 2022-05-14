import React, { useEffect, useState } from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import Footer from "../components/Footer"
import LeftMenu from "../components/LeftMenu"
import Nav from "../components/Nav"
import HomePage from "./HomePage";
import Login from "./Login";
import Movie from "./Movie";
import Profile from "./Profile";
import Register from "./Register";
import Report from "./Report";
import Serie from "./Serie";

import './css/front.scss';

export default function Front({ token }) {
  const [openMenu, setOpenMenu] = useState(false);

  const handleMenuClick = () => {
    setOpenMenu(!openMenu);
    const leftNav = document.querySelector(".left-menu");
    leftNav.style.left = openMenu ? "-300px" : "0px";
    leftNav.style.backgroundColor = "#0c0f21";
  };

  return (
    <div>
      <Nav handleMenuClick={handleMenuClick} menuState={openMenu} />
      <LeftMenu className="leftnav" />
      <div className="main-section" style={{ minHeight: "100vh" }}>
        
        <Switch>
          <Route path={`/movie/:id/:slug`}>
            <Movie />
          </Route>
          <Route path={`/serie/:id/:slug`}>
            <Serie />
          </Route>
          <Route path="/register">
            {token ? <Redirect to="/profile" /> : <Register />}
            {/* <Register /> */}
          </Route>
          <Route path="/login">
            {token ? <Redirect to="/profile" /> : <Login />}
            {/* <Login /> */}
          </Route>
          <Route path="/profile">
            {token ? <Profile /> : <Redirect to="/login" />}
          </Route>
          <Route path="/report">{token ? <Report /> : <Login />}</Route>
          <Route path="/">
            <HomePage menuState={openMenu} />
          </Route>
        </Switch>
      </div>
      <Footer />
    </div>
  );
}
