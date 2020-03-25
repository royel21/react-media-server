import React, { Fragment, useState } from "react";
import { formatTime } from "../Shares/utils";

const PlayList = ({ playList, file }) => {
  const [filter, setFilter] = useState("");
  const filterPlayList = e => {
    setFilter(e.target.value);
  };
  console.log("list render");
  return (
    <Fragment>
      <input type="checkbox" id="p-hide" />
      <div id="play-list">
        <div className="p-controls">
          <label className="p-sort" htmlFor="p-hide">
            <i className="fas fa-angle-right"></i>
          </label>
          <input
            type="text"
            placeholder="Filter"
            className="form-control"
            onChange={filterPlayList}
          />
        </div>
        <div id="p-list">
          <ul className="list">
            {playList
              .filter(f => f.Name.includes(filter.toLocaleLowerCase()))
              .map(item => (
                <li
                  key={item.Id}
                  className={"list-item " + (item.Id === file.Id ? "active" : "")}
                >
                  <span className="cover">
                    <img src={item.Cover} alt="" />
                    <span className="duration">{formatTime(item.Duration)}</span>
                  </span>
                  <span className="l-name">{item.Name}</span>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </Fragment>
  );
};

export default PlayList;
