import React, { useState, useEffect } from "react";
import { Router } from "react-router-dom";
import axios from "axios";
import history from "./history";

import UsersRoutes from "./Users/UsersRoutes";

function App() {
  const [User, setUser] = useState({
    username: "",
    isAutenticated: false,
    isAutenticating: true,
    favorites: [],
    Config: {},
  });

  useEffect(() => {
    if (!User.isAutenticated) {
      axios.get("/api/users/getuser").then((resp) => {
        setUser({ ...resp.data, isAutenticating: false });
      });
    }
  }, [User.isAutenticated]);
  return (
    <Router history={history}>
      {User.isAutenticating ? (
        <div></div>
      ) : User.isAutenticated ? (
        <Route path="/*" render={(props) => <UsersRoutes {...props} User={User} />} />
      ) : (
        <Route path="/*" component={LoginRedirct} />
      )}
    </Router>
  );
}

export default App;
