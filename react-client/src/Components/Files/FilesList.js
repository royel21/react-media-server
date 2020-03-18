import React, { useContext } from "react";

import Files from "./Files";
import FileFilter from "./FileFilter";
import Pagination from "./Pagination";
import FileListHooks from "./FileListHooks";
import FavoritiesManager from "./FavoriteManager";

import { fileNavKeydown, fileNavClick } from "../KeyboardNav";
import { genUrl } from "./utils";

import { PageConfigContext } from "../../Context/PageConfigContext";
import { FilesContext } from "../../Context/FilesContext";

const FilesList = props => {
  const { pageConfig } = useContext(PageConfigContext);
  const { files, totalFiles, totalPages } = useContext(FilesContext).filesData;
  const { page, filter, goToPage, fileFilter, processFile } = FileListHooks(props, pageConfig);

  const loadFavorite = fav => {
    props.history.push(genUrl(page, pageConfig, filter, "favorities", true, fav));
  };

  return (
    <React.Fragment>
      {files.length > 0 ? (
        <div
          id="files-list"
          onClick={fileNavClick}
          onKeyDown={e => {
            fileNavKeydown(e, page, pageConfig.fPerPage, goToPage);
          }}
        >
          <Files files={files} processFile={processFile} type={props.type} />
        </div>
      ) : (
        <div id="files-list"></div>
      )}
      <div className="controls">
        {props.type.includes("favorities") ? (
          <FavoritiesManager fav={props.id} loadFavorite={loadFavorite} />
        ) : (
          ""
        )}
        <FileFilter
          {...props}
          fileFilter={fileFilter}
          filter={filter}
          showback={props.type.includes("folder-content")}
        />
        <Pagination
          data={{
            goToPage,
            page,
            totalFiles: totalFiles,
            totalPages: totalPages
          }}
        />
        <span className="badge badge-primary total-files">{totalFiles}</span>
      </div>
    </React.Fragment>
  );
};

export default FilesList;
