import React from "react";
import formatTime from "../modules/time-utils";

import "./File.css";

const File = ({ files, type }) => {
  return files.map(file => {
    return (
      <div key={file.Id} id={file.Id} className="file" tabIndex="0">
        <div className="file-info">
          <div className="file-btns">
            <i
              className={
                "fas fa-" + (type === "mangas" ? "book-open" : "play-circle")
              }
            />
            <span className="file-progress">
              {type.includes("mangas")
                ? file.CurrentPos + "/" + file.Duration
                : formatTime(file.CurrentPos) + "/" + formatTime(file.Duration)}
            </span>
            <i
              className={
                file.isFav ? "fas fa-star text-warning" : "far fa-star"
              }
            />
          </div>
          <div className="file-cover">
            <img src={`/covers/${type}/${file.Id}.jpg`} alt="No Cover Found" />
          </div>
          <div>{file.Name}</div>
        </div>
      </div>
    );
  });
};

export default File;
