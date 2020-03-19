import React, { useContext } from "react";
import Axios from "axios";

import Files from "./Files";
import FileFilter from "./FileFilter";
import Pagination from "./Pagination";
import FileListHooks from "./FileListHooks";
import FavoritesManager from "./FavoriteManager";

import { fileNavKeydown, fileNavClick } from "../KeyboardNav";
import { genUrl, getFilesPerPage, PageTitles } from "./utils";

import { PageConfigContext } from "../../Context/PageConfigContext";

const FilesList = props => {
  const { pageConfig } = useContext(PageConfigContext);
  const {
    page,
    filter,
    filesData,
    setFilesData,
    goToPage,
    fileFilter,
    processFile
  } = FileListHooks(props, pageConfig);
  const { files, totalFiles, totalPages } = filesData;

  const loadFavorite = fav => {
    props.history.push(genUrl(1, pageConfig, filter, "favorites", true, fav));
  };

  const removeFavFile = fid => {
    let nextPage = page;
    if (filesData.files.length === 1) {
      nextPage = page > 1 ? page - 1 : page;
    }

    let items = pageConfig.items;
    items = items === 0 ? getFilesPerPage() : items;

    Axios.post("/api/files/favorites/remove-file", {
      id: props.id,
      fid,
      page: nextPage,
      order: pageConfig.order,
      items,
      search: filter
    }).then(({ data }) => {
      if (data.removed) {
        props.history.replace(`/favorites/${props.id}/${nextPage}/${filter}`);
        setFilesData(data.data);
      }
    });
  };

  return (
    <React.Fragment>
      {!filesData.isloading ? (
        files.length > 0 ? (
          <div
            id="files-list"
            onClick={fileNavClick}
            onKeyDown={e => {
              fileNavKeydown(e, page, pageConfig.items, goToPage);
            }}
          >
            <Files
              files={files}
              FavoriteId={props.id}
              processFile={processFile}
              type={props.type}
              removeFavFile={removeFavFile}
            />
          </div>
        ) : (
          <div id="files-list" className="loading">
            <h3>{`No ${PageTitles[props.type]} Available`}</h3>
          </div>
        )
      ) : (
        <div id="files-list" className="loading">
          <h3>Loading Data Wait...</h3>
        </div>
      )}
      <div className="controls">
        {props.type.includes("favorites") ? (
          <FavoritesManager id={props.id} loadFavorite={loadFavorite} />
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
