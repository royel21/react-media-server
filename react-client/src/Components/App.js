import React, { useState, useEffect } from "react";
import { Router, Switch, Route } from "react-router-dom";
import axios from "axios";

import Navbar from "./Navbar";
import Home from "./Home";
import Mangas from "./Mangas";
import Videos from "./Videos";
import Favorities from "./Favorities";
import Login from "./Login";

import { fileNavClick, fileNavKeydown } from "./KeyboardNav";
import "./PageControls.css";

import history from "./history";

function App() {
  const [User, setUser] = useState({ username: "", isAutenticated: false });
  const [showLogin, setShowLogin] = useState(false);
  useEffect(() => {
    axios.get("/api/user/getuser").then(resp => {
      if (resp.data.isAutenticated) {
        setUser(resp.data);
      } else {
        setShowLogin(true);
      }
    });
  }, [User.isAutenticated, showLogin]);

  return !User.isAutenticated ? (
    showLogin ? (
      <Login setUser={setUser} history={history} />
    ) : (
      <div></div>
    )
  ) : (
    <Router history={history}>
      <Navbar setUser={setUser} />
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
