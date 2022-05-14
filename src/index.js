import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import axios from "axios";

axios.defaults.baseURL = "http://192.168.3.7:8001/api";

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <App style={{ backgoundColor: '#000' }} />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
