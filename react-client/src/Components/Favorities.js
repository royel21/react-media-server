import React from "react";
import FilesList from "./Files/FilesList";

const Favorities = props => {
  return <FilesList {...props} type="favorities" />;
};

export default Favorities;
