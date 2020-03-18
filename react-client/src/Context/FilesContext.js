import React, { createContext, useState } from "react";

export const FilesContext = createContext();

const FilesContextProvider = props => {
  const [filesData, setFilesData] = useState({
    files: [],
    totalPages: 0,
    totalFiles: 0
  });

  return (
    <FilesContext.Provider value={{ filesData, setFilesData }}>
      {props.children}
    </FilesContext.Provider>
  );
};

export default FilesContextProvider;
