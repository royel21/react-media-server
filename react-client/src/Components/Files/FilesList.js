import React, { useContext } from "react";

import Files from "./Files";
import FileFilter from "./FileFilter";
import Pagination from "./Pagination";
import FileListHooks from "./FileListHooks";
import FavoritiesManager from "./FavoriteManager";

import { fileNavKeydown, fileNavClick } from "../KeyboardNav";
import { genUrl } from "./utils";

import { PageConfigContext } from "../../Context/PageConfigContext";

const FilesList = props => {
  const { pageConfig } = useContext(PageConfigContext);
  const {
    page,
    filter,
    pagedata,
    goToPage,
    fileFilter,
    processFile
  } = FileListHooks(props, pageConfig);

  const loadFavorite = fav => {
    props.history.push(
      genUrl(page, pageConfig, filter, "favorities", true, fav)
    );
  };

  return (
    <React.Fragment>
      {pagedata.files.length > 0 ? (
        <div
          id="files-list"
          onClick={fileNavClick}
          onKeyDown={e => {
            fileNavKeydown(e, page, pageConfig.fPerPage, goToPage);
          }}
        >
          <Files
            files={pagedata.files}
            processFile={processFile}
            type={props.type}
          />
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
            totalFiles: pagedata.totalFiles,
            totalPages: pagedata.totalPages
          }}
        />
        <span className="badge badge-primary total-files">
          {pagedata.totalFiles}
        </span>
      </div>
    </React.Fragment>
  );
};

export default FilesList;
