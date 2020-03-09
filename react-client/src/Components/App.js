import React from "react";
import { Router, Switch, Route } from "react-router-dom";

import Navbar from "./Navbar";
import Home from "./Home";
import Mangas from "./Mangas";
import Videos from "./Videos";

import { fileNavClick, fileNavKeydown } from "./KeyboardNav";
import "./PageControls.css";

import history from "./history";

function App() {
  return (
    <Router history={history}>
      <Navbar />
      <div
        className="content"
        onClick={fileNavClick}
        onKeyDown={fileNavKeydown}
      >
        <Switch>
          <Route
            path="/mangas/:order/:page?/:filter?"
            render={props => <Mangas {...props} type={"mangas"} />}
          />
          <Route
            path="/videos/:order/:page?/:filter?"
            render={props => <Mangas {...props} type={"videos"} />}
          />
          <Route path="/" component={Home} />
        </Switch>
      </div>
    </Router>
  );
}

window.addEventListener("popstate", e => {
  console.log(e.state);
});

export default App;
