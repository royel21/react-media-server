import React, { useContext } from "react";

import Files from "./Files";
import FileFilter from "./FileFilter";
import Pagination from "./Pagination";
import FileListHooks from "./FileListHooks";
import FavoritesManager from "./FavoriteManager";

import { fileNavKeydown, fileNavClick } from "../KeyboardNav";
import { genUrl } from "./utils";

import { PageConfigContext } from "../../Context/PageConfigContext";

const FilesList = props => {
  const { pageConfig } = useContext(PageConfigContext);
  const { page, filter, filesData, goToPage, fileFilter, processFile } = FileListHooks(
    props,
    pageConfig
  );
  const { files, totalFiles, totalPages } = filesData;

  const loadFavorite = fav => {
    props.history.push(genUrl(1, pageConfig, filter, "favorites", true, fav));
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
        {props.type.includes("favorites") ? (
          <FavoritesManager fav={props.id} loadFavorite={loadFavorite} />
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
