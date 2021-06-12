import React, { createContext, useState } from "react";

export const FavoriteContext = createContext();

const FavoriteContextProvider = props => {
  const [favorites, setFavorites] = useState(props.favorites);
  return (
    <FavoriteContext.Provider value={{ favorites, setFavorites }}>
      {props.children}
    </FavoriteContext.Provider>
  );
};

export default FavoriteContextProvider;
