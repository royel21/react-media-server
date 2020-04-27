import React, { useState, createContext } from "react";
import Axios from "axios";

export const UserContext = createContext();

function isPwa() {
  return ["fullscreen", "standalone", "minimal-ui"].some(
    (displayMode) => window.matchMedia("(display-mode: " + displayMode + ")").matches
  );
}

const UserContextProvider = (props) => {
  const { User, setUser } = props;
  const [favorites, setFavorites] = useState(User.favorites);
  const [config, setConfig] = useState(User.Config);

  const logOut = (e) => {
    e.preventDefault();
    Axios.post("/api/users/logout").then((resp) => {
      setUser({ isAutenticated: false });
      if (isPwa()) {
        props.history.go(-(props.history.length - 2));
      }
    });
  };
  return (
    <UserContext.Provider
      value={{ User, logOut, favorites, setFavorites, config, setConfig }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
