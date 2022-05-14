import React from "react";
import Cookies from "js-cookie";

const UserContext = React.createContext({
  // token: localStorage.getItem("token"),
  // role: localStorage.getItem("role"),
  token: Cookies.get("token"),
  role: Cookies.get("role"),
});

export default UserContext;
