import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import axios from "axios";

axios.defaults.baseURL = "http://185.21.60.195:8000/api";
// axios.defaults.baseURL = "http://127.0.0.1:8000/api";

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <App style={{ backgroundColor: '#000' }} />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
