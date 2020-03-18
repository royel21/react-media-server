import React, { useState, Fragment } from "react";
import { FileTypes } from "./utils";

import "./File.css";
import FavoriteActions from "./FavoriteActions";

const File = ({ files, processFile, type }) => {
  const [showAddFav, setShowAddFav] = useState({
    show: false,
    fileId: ""
  });

  const fileActions = e => {
    let file = e.target.closest(".file");
    if (e.target.classList.contains("fa-star")) {
      setShowAddFav({
        show: true,
        fileId: file.id
      });
    } else {
      console.log("remove");
    }
  };
  const hideFileActions = e => {
    if (!e.target.classList.contains("fa-star")) {
      setShowAddFav({ show: false, fileId: "" });
    }
  };

  return (
    <Fragment>
      {files.map(({ Id, Name, Type, isFav, CurrentPos, Duration, Cover }) => {
        let t = FileTypes[Type];
        console.log(Cover);
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
                  className={
                    type === "favorites"
                      ? "fas fa-trash-alt text-danger"
                      : isFav
                      ? "fas fa-star text-warning"
                      : "far fa-star"
                  }
                  onClick={fileActions}
                />
              </div>
              <div className="file-cover">
                <img src={Cover} alt="No Cover Found" />
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
