import React from "react";
import formatTime from "../../modules/time-utils";

import "./File.css";
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
      return `${formatTime(a)}/${formatTime(b)}`;
    }
  },
  folders: {
    class: "folder-open",
    formatter(a, b) {
      return "";
    }
  }
};

const File = ({ files }) => {
  return files.map(({ Id, Name, Type, isFav, CurrentPos, Duration }) => {
    let ftype = Type ? Type.toLowerCase() + "s" : "folders";
    let t = fileTypes[ftype];

    return (
      <div
        key={Id}
        id={Id}
        className="file"
        data-type={Type ? Type : "Folder"}
        tabIndex="0"
      >
        <div className="file-info">
          <div className="file-btns">
            <i className={"fas fa-" + t.class} />
            <span className="file-progress">
              {t.formatter(CurrentPos || 0, Duration)}
            </span>
            <i className={isFav ? "fas fa-star text-warning" : "far fa-star"} />
          </div>
          <div className="file-cover">
            <img src={`/covers/${ftype}/${Id}.jpg`} alt="No Cover Found" />
          </div>
          <div>{Name}</div>
        </div>
      </div>
    );
  });
};

export default File;
