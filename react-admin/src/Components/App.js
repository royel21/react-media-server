import React, { useState, useEffect } from "react";
import { Router, Switch, Route } from "react-router-dom";
import axios from "axios";

import Home from "./Home";
import LoginRedirct from "./LoginRedirect";

import history from "./history";

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
      {User.isAutenticated ? (
        <div id="content">
          <Switch>
            <Route exact path="*" component={Home} />
          </Switch>
        </div>
      ) : (
        <LoginRedirct />
      )}
    </Router>
  );
}

export default App;
