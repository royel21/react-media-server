import React, { useCallback } from "react";
import FilesList from "./Shares/FilesList";
import { useParams } from "react-router-dom";

const Folders = props => {
  const { id } = useParams();

  let exitFolder = useCallback(() => {
    let pathname = window.local.getObject("folder").pathname || "/folders";
    props.history.push(pathname);
  }, [props.history]);

  return (
    <FilesList
      {...props}
      exitFolder={exitFolder}
      type={id ? "folder-content" : "folders"}
      id={id}
      showback={id !== undefined}
    />
  );
};

export default Folders;
