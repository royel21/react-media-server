import React from "react";
import { Router, Switch, Route } from "react-router-dom";

import Navbar from "./Navbar";
import Home from "./Home";
import Mangas from "./Mangas";
import Videos from "./Videos";
import Favorities from "./Favorities";
import Login from "./Login";

import { fileNavClick, fileNavKeydown } from "./KeyboardNav";
import "./PageControls.css";

import history from "./history";
const user = { isAutenticate: true };

function App() {
  return user.isAutenticate ? (
    <Login />
  ) : (
    <Router history={history}>
      <Navbar />
      <div
        className="content"
        onClick={fileNavClick}
        onKeyDown={fileNavKeydown}
      >
        <Switch>
          <Route path="/mangas/:order?/:page?/:filter?" component={Mangas} />}
          />
          <Route path="/videos/:order?/:page?/:filter?" component={Videos} />}
          />
          <Route
            path="/favorities/:order?/:favvorite?/:page?/:filter?"
            component={Favorities}
          />
          } />
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
