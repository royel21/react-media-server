import React, { useState, useEffect, Fragment } from "react";
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
  const [User, setUser] = useState({
    username: "",
    isAutenticated: false
  });
  console.log(User);
  useEffect(() => {
    if (!User.isAutenticated) {
      axios.get("/api/users/getuser").then(resp => {
        if (resp.data.isAutenticated) {
          setUser(resp.data);
          console.log("axio-getuser");
        }
      });
    }
    console.log("axio-getuser");
  }, [User.isAutenticated]);
  console.log("user", User);

  return (
    <Router history={history}>
      {User.isAutenticated ? (
        <Fragment>
          <Navbar setUser={setUser} history={history} />
          <div
            className="content"
            onClick={fileNavClick}
            onKeyDown={fileNavKeydown}
          >
            <Switch>
              <Route
                path="/mangas/:order?/:page?/:filter?"
                component={Mangas}
              />
              <Route
                path="/videos/:order?/:page?/:filter?"
                component={Videos}
              />
              <Route
                path="/favorities/:order?/:favvorite?/:page?/:filter?"
                component={Favorities}
              />
              <Route path="/" component={Home} />
            </Switch>
          </div>
        </Fragment>
      ) : (
        <Route
          path="/"
          render={props => <Login {...props} setUser={setUser} />}
        />
      )}
    </Router>
  );
}

window.addEventListener("popstate", e => {
  console.log(e.state);
});

export default App;
