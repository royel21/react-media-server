import React, { useState, createContext } from "react";
import Axios from "axios";

export const UserContext = createContext();

const UserContextProvider = (props) => {
  const { User, setUser } = props;
  const [favorites, setFavorites] = useState(User.favorites);
  const [config, setConfig] = useState(User.Config);

  const logOut = (e) => {
    e.preventDefault();
    Axios.post("/api/users/logout").then((resp) => {
      setUser({ isAutenticated: false });
      props.history.push("/");
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
