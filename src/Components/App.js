import React, { useState, useEffect, useRef } from "react";
import { Router, Route } from "react-router-dom";
import socketIOClient from "socket.io-client";
import axios from "axios";

import history from "./history";
import Login from "./Shares/Login";

import UsersRoutes from "./Users/UsersRoutes";
import AdminRoute from "./Admins/AdminRoute";
import SockectContextProvider from "./Context/SockectContext";
import UserContextProvider from "./Context/UserContext";
import TestComponent from "./TestComponent";

function App() {
  const socketRef = useRef();
  const [User, setUser] = useState({
    username: "",
    role: "",
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
      if (!socketRef.current) {
        socketRef.current = socketIOClient("/");
      }
    }
  }, [User.isAutenticated]);
  return (
    <Router history={history}>
      {User.isAutenticating ? (
        <div></div>
      ) : User.isAutenticated ? (
        <UserContextProvider history={history} User={User} setUser={setUser}>
          <SockectContextProvider socket={socketRef.current}>
            {
              /* {!User.role.includes("Administrator") ? (
              <Route path="/*" component={UsersRoutes} />
            ) : (
              <Route path="/*" component={AdminRoute} />
            )} */
              <TestComponent />
            }
          </SockectContextProvider>
        </UserContextProvider>
      ) : (
        <Route
          path="/*"
          render={(props) => <Login {...props} setUser={setUser} />}
        />
      )}
    </Router>
  );
}

export default App;
