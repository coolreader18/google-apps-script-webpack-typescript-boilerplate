import App, { AppProps } from "./App";
import ReactDOM from "react-dom";
import React from "react";

declare var __INITIAL_STATE__: AppProps;

ReactDOM.render(<App {...__INITIAL_STATE__} />, document.getElementById("app"));
