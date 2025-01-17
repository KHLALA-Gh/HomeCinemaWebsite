import "./index.css";
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import Router from "./components/Router/Router";

hydrateRoot(
  document.getElementById("root"),
  <StrictMode>
    <Router />
  </StrictMode>
);
