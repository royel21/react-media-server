import React from "react";
import FilesList from "./Files/FilesList";
import { useParams } from "react-router-dom";

const Folders = props => {
  const { id } = useParams();
  return <FilesList {...props} type={id ? "folder-content" : "folders"} id={id} />;
};

export default Folders;
