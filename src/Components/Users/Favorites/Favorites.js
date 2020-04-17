import React, { useContext, useCallback } from "react";
import Axios from "axios";

import { useParams } from "react-router-dom";

import Files from "../Shares/Files";
import FileFilter from "../../Shares/FileFilter";
import Pagination from "../../Shares/Pagination";
import FavoritesManager from "./FavoriteManager";
import FileListHooks from "../Shares/FileListHooks";
import Loading from "../Shares/Loading";

import { fileClicks, fileKeypress } from "../Shares/FileEventsHandler";
import { genUrl, getFilesPerPage } from "../Shares/utils";

import { UserContext } from "../../Context/UserContext";

import "./Favorites.css";

const Favorites = (props) => {
  let { id, filter = "", page } = useParams();
  const { favorites, config } = useContext(UserContext);

  const { filesData, setFilesData, goToPage, fileFilter, processFile } = FileListHooks({
    ...props,
    id: id || favorites[0].Id,
    type: "favorites",
  });

  const { files, totalFiles, totalPages } = filesData;

  const loadFavorite = useCallback(
    (fav) => {
      props.history.push(genUrl(1, config, filter, "favorites", true, fav));
    },
    [props.history, filter, config]
  );

  const removeFavFile = (fileId) => {
    let nextPage = page;
    if (filesData.files.length === 1) {
      nextPage = page > 1 ? page - 1 : page;
    }

    let items = config.items;
    items = items === 0 ? getFilesPerPage(3) : items;

    Axios.post("/api/files/favorites/remove-file", {
      id,
      fid: fileId,
      page: nextPage,
      order: config.order,
      items,
      search: filter,
    }).then(({ data }) => {
      if (data.removed) {
        props.history.replace(`/favorites/${id}/${nextPage}/${filter}`);
        setFilesData(data.data);
      }
    });
  };

  return (
    <React.Fragment>
      {!filesData.isloading ? (
        files.length > 0 ? (
          <div
            id="fav-file-list"
            className="files-list"
            onDoubleClick={processFile}
            onClick={(e) => {
              e.persist();
              fileClicks(e.target, processFile);
            }}
            onKeyDown={(e) => {
              e.persist();
              fileKeypress(e, page, goToPage, processFile);
            }}
          >
            <Files
              files={files}
              FavoriteId={id}
              type={"favorites"}
              removeFavFile={removeFavFile}
            />
          </div>
        ) : (
          <div className="files-list loading">
            <h4>{`This Favorite Has not files added`}</h4>
          </div>
        )
      ) : (
        <Loading />
      )}
      <div className="controls">
        <FavoritesManager id={id} loadFavorite={loadFavorite} />
        <FileFilter fileFilter={fileFilter} filter={filter} />
        <Pagination
          data={{
            goToPage,
            page,
            totalFiles: totalFiles,
            totalPages: totalPages,
          }}
        />
        <span className="badge badge-primary total-files">{totalFiles}</span>
      </div>
    </React.Fragment>
  );
};

export default Favorites;
