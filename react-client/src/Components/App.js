import React, { useState, useEffect } from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";
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
import PageConfigContextProvider from "../Context/PageConfigContext";

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
  console.log(history.location);
  return (
    <Router history={history}>
      {User.isAutenticated ? (
        <PageConfigContextProvider>
          <Navbar setUser={setUser} User={User} />
          <div className="content">
            <Switch>
              <Route
                path={["/folders/:page?/:filter?", "/folder-content/:id/:page?/:filter?"]}
                component={Folders}
              />
              <Route path="/mangas/:page?/:filter?" component={Mangas} />
              <Route path="/videos/:page?/:filter?" component={Videos} />
              <Route path="/favorities/:id?/:page?/:filter?" component={Favorities} />
              <Route exact path="/" component={Home} />
            </Switch>
          </div>
        </PageConfigContextProvider>
      ) : (
        <Route
          path="/"
          render={props =>
            User.isAutenticating ? <div></div> : <Login {...props} setUser={setUser} />
          }
        />
      )}
    </Router>
  );
}

export default App;
