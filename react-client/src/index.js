import React from "react";
import { render } from "react-dom";
import "bootstrap/dist/css/bootstrap.css";

import "./index.css";
import App from "./Components/App";

render(<App />, document.getElementById("root"));

window.addEventListener("popstate", event => {});
