import React, { createContext, useState } from "react";

export const FavoriteContext = createContext();

const FavoriteContextProvider = props => {
  const [favorities, setFavorities] = useState(props.favorities);
  return (
    <FavoriteContext.Provider value={{ favorities, setFavorities }}>
      {props.children}
    </FavoriteContext.Provider>
  );
};

export default FavoriteContextProvider;
