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

    const site_key = "6Lek_I0fAAAAAFKQ_9bWD62yBEam1K4B68aYmeDt";
    const site_secret = "6Lek_I0fAAAAAGs_biBQpThbUVoaD4bsjA-D72bY";

    // if (isCatptcha) {
      axios
        .post("/login", data)
        .then((res) => {
          console.log(res.data);
          if (res.data.error) {
            setMsg((prev) => [...prev, res.data.error]);
            // console.log(res.data.error);
          } else if (res.data.ban) {
            setMsg((prev) => [...prev, res.data.ban]);
          } else {
            // console.log(res.data);
            // setUser(res.data.user);
            // setToken(res.data.token);

            // localStorage.setItem("token", res.data.token);
            // localStorage.setItem("role", res.data.user.role);
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
            setIsCatptcha(false);
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.response.data.message) {
            setMsg((prev) => [...prev, err.response.data.message]);
          }
          if (err.response.data.error) {
            setMsg((prev) => [...prev, err.response.data.error]);
          }
        });
    // }
  };

  function onCaptchaChange(value) {
    setIsCatptcha(true);
    // console.log("Captcha value:", value);
  }

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

          {/* <ReCAPTCHA
            sitekey="6Lek_I0fAAAAAFKQ_9bWD62yBEam1K4B68aYmeDt"
            onChange={onCaptchaChange}
            onExpired={() => setIsCatptcha(false)}
          /> */}

          <button
            onClick={(e) => handleSubmit(e)}
            className="w-full text-center py-3 rounded bg-green text-indigo-800 bg-white font-bold my-1"
            // disabled={!isCatptcha}
          >
            Connexion
          </button>
          {/* <div className="flex gap-4 mt-4 items-center">
            <p className="text-white">Vous n'avez pas encore de compte ?</p>
            <a href="/register" className="text-blue-500 font-bold">
              Enregistrez vous
            </a>
          </div> */}
        </div>
      </div>
    </div>
  );
}
