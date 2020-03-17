import React, { useContext } from "react";
import FilesList from "./Files/FilesList";
import { useParams } from "react-router-dom";

import { FavoriteContext } from "../Context/FavoriteContext";

const Favorities = props => {
  let { id } = useParams();

  const { favorities } = useContext(FavoriteContext);
  return <FilesList {...props} type="favorities" id={id || favorities[0].Id} />;
};

export default Favorities;
