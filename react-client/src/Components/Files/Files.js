import React, { useState, Fragment } from "react";
import utils from "../../modules/utils";

import "./File.css";
import FavoriteActions from "./FavoriteActions";
const fileTypes = {
  mangas: {
    class: "book-open",
    formatter(a, b) {
      return `${a}/${b}`;
    }
  },
  videos: {
    class: "play-circle",
    formatter(a, b) {
      return `${utils.formatTime(a)}/${utils.formatTime(b)}`;
    }
  },
  folders: {
    class: "folder-open",
    formatter() {
      return "";
    }
  },
  favorities: {
    class: "trash-alt",
    formatter() {}
  }
};

const File = ({ files, processFile, type }) => {
  const [showAddFav, setShowAddFav] = useState({
    show: false,
    fileId: ""
  });

  const showFavList = e => {
    let sf = {
      show: false,
      fileId: ""
    };
    if (e.target.classList.contains("fa-star")) {
      sf.show = true;
      sf.fileId = e.target.closest(".file").id;
    }
    setShowAddFav(sf);
  };

  return (
    <Fragment>
      {files.map(({ Id, Name, Type, isFav, CurrentPos, Duration }) => {
        let t = fileTypes[type];
        return (
          <div
            key={Id}
            id={Id}
            className="file"
            data-type={Type ? Type : "Folder"}
            tabIndex="0"
            onClick={showFavList}
          >
            {type !== "favorities" &&
            showAddFav.show &&
            showAddFav.fileId === Id ? (
              <FavoriteActions
                showAddFav={showAddFav}
                setShowAddFav={setShowAddFav}
              />
            ) : (
              ""
            )}
            <div className="file-info">
              <div className="file-btns">
                <i className={"fas fa-" + t.class} onClick={processFile} />
                <span className="file-progress">
                  {t.formatter(CurrentPos || 0, Duration)}
                </span>
                <i
                  className={isFav ? "fas fa-star text-warning" : "far fa-star"}
                />
              </div>
              <div className="file-cover">
                <img src={`/covers/${type}/${Id}.jpg`} alt="No Cover Found" />
              </div>
              <div>{Name}</div>
            </div>
          </div>
        );
      })}
    </Fragment>
  );
};

export default File;
