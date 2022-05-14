import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import UserContext from "./Context/UserContext";
import Front from "./pages/Front";
import Dashboard from "./pages/Moderator/Dashboard";
import Cookies from "js-cookie";

function App() {
  const [openMenu, setOpenMenu] = useState(false);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);

  const handleMenuClick = () => {
    setOpenMenu(!openMenu);
    const leftNav = document.querySelector(".left-menu");
    leftNav.style.left = openMenu ? "-300px" : "0px";
    leftNav.style.backgroundColor = "#0c0f21";
  };

  useEffect(() => {
    setRole(Cookies.get("role"));
    setToken(Cookies.get("token"));
    // console.log(role);

    return () => {
      setToken(null);
    };
  }, []);

  return (
    <Router>
      <UserContext.Provider
        value={{
          token: Cookies.get("token"),
          role: Cookies.get("role"),
        }}
      >
        <Switch>
          <Route path="/moderator">
            {role == "moderator" || role === "admin" ? (
              <Dashboard />
            ) : (
              <Front token={token} />
            )}
          </Route>
          <Route path="/">
            <Front token={token} />
          </Route>
        </Switch>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
