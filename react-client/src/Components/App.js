import React, { useState, useEffect } from "react";
import { Router, Switch, Route } from "react-router-dom";
import axios from "axios";

import Navbar from "./Navbar";
import Home from "./Home";
import Folders from "./Folders";
import Mangas from "./Mangas";
import Favorites from "./Favorites/Favorites";
import Videos from "./Videos";
import LoginRedirct from "./LoginRedirect";

import "./Shares/PageControls.css";

import history from "./history";
import PageConfigContextProvider from "../Context/PageConfigContext";
import FavoriteContextProvider from "../Context/FavoriteContext";
import Viewer from "./Viewer/Viewer";

function App() {
  const [User, setUser] = useState({
    username: "",
    isAutenticated: false,
    isAutenticating: true,
    favorites: []
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
      {User.isAutenticating ? (
        <div></div>
      ) : User.isAutenticated ? (
        <PageConfigContextProvider>
          <Navbar setUser={setUser} User={User} />
          <FavoriteContextProvider favorites={User.favorites}>
            <div id="content">
              <Switch>
                <Route
                  path={[
                    "/folders/:page?/:filter?",
                    "/folder-content/:id/:page?/:filter?"
                  ]}
                  component={Folders}
                />
                <Route path="/mangas/:page?/:filter?" component={Mangas} />
                <Route path="/videos/:page?/:filter?" component={Videos} />
                <Route path="/favorites/:id?/:page?/:filter?" component={Favorites} />
                <Route path="/viewer/:type/:id/:fileId?" component={Viewer} />
                <Route exact path="/" component={Home} />
                <Route
                  path="/*"
                  render={props => <LoginRedirct {...props} Auth={User.isAutenticated} />}
                />
              </Switch>
            </div>
          </FavoriteContextProvider>
        </PageConfigContextProvider>
      ) : (
        <Route path="/*" component={LoginRedirct} />
      )}
    </Router>
  );
}

export default App;
