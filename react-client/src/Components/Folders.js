import React from "react";
import FilesList from "./Files/FilesList";
import { useParams } from "react-router-dom";

const Folders = props => {
  return (
    <FilesList
      {...props}
      type={useParams().id ? "folder-content" : "folders"}
    />
  );
};

export default Folders;
