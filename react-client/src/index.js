import React from "react";
import { render } from "react-dom";
import "bootstrap/dist/css/bootstrap.css";

import "./index.css";
import "./utils";

import App from "./Components/App";
import socketIOClient from "socket.io-client";

window.socket = socketIOClient("/");

render(<App />, document.getElementById("root"));

window.addEventListener("beforeunload", e => {
  window.socket.close();
  console.log("unloaded");
});

var runningClock;

window.addEventListener("fullscreenchange", e => {
  if (document.fullscreenElement) {
    console.log("fullscreen");
    const clock = document.getElementById("clock");
    if (clock) {
      clock.innerText = new Date().toLocaleTimeString("en-US");
      runningClock = setInterval(() => {
        clock.innerText = new Date().toLocaleTimeString("en-US");
      }, 1000);
    }
  } else {
    console.log("window mode");
    clearInterval(runningClock);
  }
});
