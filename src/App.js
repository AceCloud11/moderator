import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory,
} from "react-router-dom";
import { useState, useEffect } from "react";
import UserContext from "./Context/UserContext";
import Dashboard from "./pages/Moderator/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cookies from "js-cookie";

function App() {
  let history = useHistory();
  const [openMenu, setOpenMenu] = useState(false);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [tag, setTag] = useState();

  const handleMenuClick = () => {
    setOpenMenu(!openMenu);
    const leftNav = document.querySelector(".left-menu");
    leftNav.style.left = openMenu ? "-300px" : "0px";
    leftNav.style.backgroundColor = "#0c0f21";
  };

  useEffect(() => {
    setRole(Cookies.get("role"));
    setToken(Cookies.get("token"));
    console.log(Cookies.get("role"));

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
            {Cookies.get("role") == "moderator" ? (
              <Dashboard />
            ) : (
              <Redirect to="/login" />
            )}
          </Route>

          <Route path="/login">
            {Cookies.get("role") == "moderator" ? (
              <Redirect to="/moderator" />
            ) : (
              <Login />
            )}
          </Route>

          <Route path="/register">
            {Cookies.get("role") == "moderator" ? (
              <Redirect to="/moderator" />
            ) : (
              <Register />
            )}
          </Route>

          <Route exact path="/">
            {Cookies.get("role") == "moderator" ? (
              <Redirect to="/moderator" />
            ) : (
              <Redirect to="/login" />
            )}
          </Route>
        </Switch>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
