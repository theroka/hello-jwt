import React from "react";
import { hydrate } from "react-dom";
import App from "./App"

const root = document.getElementById("root");
hydrate(<App />, root);
