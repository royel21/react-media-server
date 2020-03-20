import React, { useState, useEffect, Fragment } from "react";
import { Router, Switch, Route } from "react-router-dom";
import axios from "axios";

import UsersManager from "./Users/UsersManager.js";
import FilesManager from "./FilesManager.js";
import DiskManager from "./DiskManager.js";
import LoginRedirct from "./LoginRedirect";

import history from "./history";
import Navbar from "./Navbar";
import FoldersManager from "./FoldersManager.js";

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
        <Fragment>
          <Navbar User={User} />
          <div id="content">
            <Switch>
              <Route
                exact
                path={["/admin", "/admin/users"]}
                component={UsersManager}
              />
              <Route path="/admin/files" component={FilesManager} />
              <Route path="/admin/folders" component={FoldersManager} />
              <Route path="/admin/directories" component={DiskManager} />
              <Route
                path="/admin/*"
                render={props => (
                  <LoginRedirct {...props} Auth={User.isAutenticated} />
                )}
              />
            </Switch>
          </div>
        </Fragment>
      ) : (
        <Route path="/*" component={LoginRedirct} />
      )}
    </Router>
  );
}

export default App;
