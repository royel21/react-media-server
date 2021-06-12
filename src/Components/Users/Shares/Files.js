import React, { useState, Fragment } from "react";
import { FileTypes } from "./utils";

import "./File.css";
import FavoriteActions from "./FavoriteActions";

const File = ({ files, type, removeFavFile }) => {
  const [showAddFav, setShowAddFav] = useState({
    show: false,
    fileId: "",
  });

  const fileActions = (e) => {
    let file = e.target.closest(".file");
    if (e.target.classList.contains("fa-star")) {
      setShowAddFav({
        show: true,
        fileId: file.id,
      });
    } else {
      removeFavFile(file.id);
    }
  };
  const hideFileActions = (e) => {
    if (!e.target.classList.contains("fa-star")) {
      setShowAddFav({ show: false, fileId: "" });
    }
  };

  return (
    <Fragment>
      {files.map(
        ({ Id, Name, Type, isFav, CurrentPos, Duration, Cover, FileCount }) => {
          let t = FileTypes[Type];
          return (
            <div
              key={Id}
              id={Id}
              className="file"
              data-type={Type}
              tabIndex="0"
              onClick={hideFileActions}
            >
              {type !== "favorites" &&
              !isFav &&
              showAddFav.show &&
              showAddFav.fileId === Id ? (
                <FavoriteActions
                  showAddFav={showAddFav}
                  setShowAddFav={setShowAddFav}
                  Type={Type}
                />
              ) : (
                ""
              )}
              <div className="file-info">
                <div className="file-btns">
                  <span className="file-btn-left">
                    <i id="process-file" className={"fas fa-" + t.class} />
                  </span>
                  <span className="file-progress">
                    {Type.includes("Folder")
                      ? FileCount
                      : t.formatter(CurrentPos || 0, Duration)}
                  </span>
                  <span className="file-btn-left">
                    {Type === "Folder" ? (
                      ""
                    ) : (
                      <i
                        className={
                          type === "favorites"
                            ? "fas fa-trash-alt text-danger"
                            : isFav
                            ? "fas fa-star text-warning"
                            : "far fa-star"
                        }
                        onClick={fileActions}
                      />
                    )}
                  </span>
                </div>
                <div className="file-cover">
                  <img src={Cover} alt="No Cover Found" />
                </div>
                <div>{Name}</div>
              </div>
            </div>
          );
        }
      )}
    </Fragment>
  );
};

export default File;
