import { Alert, AlertIcon } from "@chakra-ui/alert";
import axios from "axios";
import React, { useState } from "react";

import ReCAPTCHA from "react-google-recaptcha";
import Cookies from "js-cookie";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState([]);
  const [user, setUser] = useState("");
  const [token, setToken] = useState("");
  const [isCatptcha, setIsCatptcha] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      username,
      password,
    };

    setMsg([]);

    axios
      .post("/login", data)
      .then((res) => {
        if (res.data.error) {
          setMsg((prev) => [...prev, res.data.error]);
        } else if (res.data.ban) {
          setMsg((prev) => [...prev, res.data.ban]);
        } else {

          Cookies.set("token", res.data.token, { expires: 5 });
          Cookies.set("role", res.data.user.role, { expires: 5 });

          if (
            res.data.user.role === "moderator" ||
            res.data.user.role === "admin"
          ) {
            window.location.href = "/moderator";
          } else {
            window.location.href = "/profile";
          }
          setUsername("");
          setPassword("");
        }
      })
      .catch((err) => {
        if (err.response.data.message) {
          setMsg((prev) => [...prev, err.response.data.message]);
        }
        if (err.response.data.error) {
          setMsg((prev) => [...prev, err.response.data.error]);
        }
      });
    // }
  };

  return (
    <div className="flex flex-col w-100 h-screen">
      <div className="container max-w-md mx-auto flex-1 flex flex-col items-center justify-center px-2 space-y-4 mt-8">
        {msg.length
          ? msg.map((m) => (
              <Alert status="error" className="w-full rounded-md" key={m}>
                <AlertIcon />
                {m}
              </Alert>
            ))
          : null}
        <div className=" rounded shadow-md text-black w-full">
          <input
            type="text"
            className="block border border-grey-light w-full p-3 rounded mb-4 focus:outline-none"
            name="email"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            className="block border border-grey-light w-full p-3 rounded mb-4 focus:outline-none"
            name="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={(e) => handleSubmit(e)}
            className="w-full text-center py-3 rounded bg-green text-indigo-800 bg-white font-bold my-1"
          >
            Connexion
          </button>
        </div>
      </div>
    </div>
  );
}
