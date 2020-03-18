import React, { createContext, useState } from "react";
import { genUrl } from "../Components/Files/utils";
import Axios from "axios";

export const FilesContext = createContext();

const FilesContextProvider = props => {
  const [pageConfig, setPageConfig] = useState({
    order: "nu",
    fPerPage: 0
  });

  const [filesData, setFilesData] = useState({
    files: [],
    totalPages: 0,
    totalFiles: 0
  });

  const loadPage = (from, page, filter, id) => {
    Axios.get(genUrl(page, pageConfig, filter, from, false, id)).then(
      ({ data }) => {
        setFilesData(data);
      }
    );
  };
  return (
    <FilesContext.Provider
      value={{ filesData, setFilesData, loadPage, pageConfig, setPageConfig }}
    >
      {props.children}
    </FilesContext.Provider>
  );
};

export default FilesContextProvider;
