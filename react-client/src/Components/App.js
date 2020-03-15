import React, { useState, useEffect, Fragment } from "react";
import { Router, Switch, Route } from "react-router-dom";
import axios from "axios";

import Navbar from "./Navbar";
import Home from "./Home";
import Folders from "./Folders";
import Mangas from "./Mangas";
import Favorities from "./Favorities";
import Login from "./Login";
import Videos from "./Videos";
import NotFoundError from "./NotFoundError.js";

import "./Files/PageControls.css";

import history from "./history";

function App() {
  const [User, setUser] = useState({
    username: "",
    isAutenticated: false,
    isAutenticating: true
  });
  useEffect(() => {
    if (!User.isAutenticated) {
      axios.get("/api/users/getuser").then(resp => {
        setUser({ ...resp.data, isAutenticating: false });
      });
    }
  }, [User.isAutenticated]);
  return (
    <Router history={history}>
      {User.isAutenticated ? (
        <Fragment>
          <Navbar setUser={setUser} User={User} />
          <div className="content">
            <Switch>
              <Route
                path={[
                  "/folders/:order?/:page?/:filter?",
                  "/folder-content/:id/:order?/:page?/:filter?"
                ]}
                component={Folders}
              />
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
              <Route exact path="/" component={Home} />
              <Route path="/" component={NotFoundError} />
            </Switch>
          </div>
        </Fragment>
      ) : (
        <Route
          path="/"
          render={props =>
            User.isAutenticating ? (
              <div></div>
            ) : (
              <Login {...props} setUser={setUser} />
            )
          }
        />
      )}
    </Router>
  );
}

export default App;
