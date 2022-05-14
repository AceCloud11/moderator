import { Alert, AlertIcon } from "@chakra-ui/alert";
import axios from "axios";
import React, { useState, useContext } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import Cookies from "js-cookie";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [user, setUser] = useState("");
  const [token, setToken] = useState("");
  const [msg, setMsg] = useState([]);
  const [isCatptcha, setIsCatptcha] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      password === password_confirmation &&
      username !== "" &&
      email !== "" &&
      password !== ""
    ) {
      const data = {
        username,
        email,
        password,
        password_confirmation,
      };

      axios
        .post("http://192.168.3.7:8001/api/register", data)
        .then((res) => {
          if (res.data.message) {
            setMsg((prev) => [...prev, res.data.message]);
          } else {
            // console.log(res.data);
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
            setPasswordConfirmation("");
            setEmail("");
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
    } else {
      setMsg((prev) => [...prev, "Remplissez les champs obligatoires"]);
    }
  };

  function onCaptchaChange(value) {
    setIsCatptcha(true);
  }

  return (
    <div className="flex flex-col">
      <div className="container max-w-md mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <div className="rounded shadow-md text-black w-full space-y-4 mt-8">
          <h1 className="mb-8 text-3xl text-center text-white">S'inscrire</h1>

          {msg.length
            ? msg.map((m, key) => (
                <Alert status="error" className="w-full rounded-md" key={key}>
                  <AlertIcon />
                  {m}
                </Alert>
              ))
            : null}

          <input
            type="text"
            className="block border border-grey-light w-full p-3 rounded mb-4 focus:outline-none"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            className="block border border-grey-light w-full p-3 rounded mb-4 focus:outline-none"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="block border border-grey-light w-full p-3 rounded mb-4 focus:outline-none"
            name="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            className="block border border-grey-light w-full p-3 rounded mb-4 focus:outline-none"
            placeholder="Confirm Password"
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />

          <ReCAPTCHA
            sitekey="6Lek_I0fAAAAAFKQ_9bWD62yBEam1K4B68aYmeDt"
            onChange={onCaptchaChange}
            onExpired={() => setIsCatptcha(false)}
          />

          <button
            disabled={!isCatptcha}
            onClick={(e) => handleSubmit(e)}
            className="w-full text-center py-3 rounded bg-green text-indigo-800 bg-white font-bold my-1"
          >
            Créer un compte
          </button>
        </div>
      </div>
    </div>
  );
}
