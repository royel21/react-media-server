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

function App() {
  const socketRef = useRef();
  const [User, setUser] = useState({
    Id: "",
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
    }

    history.replace("/");
  }, [User.isAutenticated]);
  //handle socket connection
  if (User.isAutenticated && !socketRef.current) {
    socketRef.current = socketIOClient("/");
    console.log("Create socket");
  } else if (socketRef.current) {
    //close socket connection if logout
    socketRef.current.close();
    socketRef.current = null;
    console.log("Close socket");
  }

  return (
    <Router history={history}>
      {User.isAutenticating ? (
        <div></div>
      ) : User.isAutenticated ? (
        <UserContextProvider history={history} User={User} setUser={setUser}>
          <SockectContextProvider socket={socketRef.current}>
            {!User.role.includes("Administrator") ? (
              <Route path="/*" component={UsersRoutes} />
            ) : (
              <Route path="/*" component={AdminRoute} />
            )}
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
