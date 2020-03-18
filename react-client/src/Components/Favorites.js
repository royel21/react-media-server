import React, { useContext } from "react";
import FilesList from "./Files/FilesList";
import { useParams } from "react-router-dom";

import { FavoriteContext } from "../Context/FavoriteContext";

const Favorites = props => {
  let { id } = useParams();

  const { favorites } = useContext(FavoriteContext);
  return <FilesList {...props} type="favorites" id={id || favorites[0].Id} />;
};

export default Favorites;
