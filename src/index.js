import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, BrowserRouter as Router } from "react-router-dom"; // Import Router
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root")); // Define root

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
