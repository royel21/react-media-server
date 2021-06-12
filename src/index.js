import React from "react";
import { render } from "react-dom";
import "bootstrap/dist/css/bootstrap.css";

import App from "./Components/App";
import "./index.css";

window.local = localStorage;

Storage.prototype.setObject = function (key, value) {
  this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function (key) {
  let value = this.getItem(key);
  if (value === "undefined") return {};
  try {
    value = JSON.parse(value);
  } catch (err) {
    console.log(err);
  }
  return value;
};

var runningClock;

window.addEventListener("fullscreenchange", (e) => {
  if (document.fullscreenElement) {
    const clock = document.getElementById("clock");
    if (clock) {
      clock.innerText = new Date().toLocaleTimeString("en-US");
      runningClock = setInterval(() => {
        clock.innerText = new Date().toLocaleTimeString("en-US");
      }, 1000);
    }
  } else {
    clearInterval(runningClock);
  }
});

render(<App />, document.getElementById("root"));
