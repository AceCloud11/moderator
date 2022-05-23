import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import UserContext from "./Context/UserContext";
import Dashboard from "./pages/Moderator/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cookies from "js-cookie";

function App() {

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
