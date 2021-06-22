import React from "react";
import ReactDom from "react-dom";
import App from "./App.js";
import flexible from "./lib-fiexible";
flexible(window, window["lib"] || (window["lib"] = {}));
ReactDom.render(<App />, document.querySelector("#app"));
