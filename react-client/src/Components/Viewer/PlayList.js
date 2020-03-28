import React, { Fragment, useState, useEffect } from "react";
import { formatTime } from "../Shares/utils";

const PlayList = ({ playList, setFile, fileId, hideList }) => {
  const [filter, setFilter] = useState("");
  const filterPlayList = e => {
    setFilter(e.target.value);
  };

  const clearFilter = () => {
    setFilter("");
  };
  const selectFile = e => {
    let li = e.target.closest("li");
    if (li) {
      setFile(li.id);
    }
  };
  useEffect(() => {
    document.getElementById(fileId).scrollIntoView();
  }, [fileId]);
  return (
    <Fragment>
      <input type="checkbox" id="p-hide" defaultChecked={true} />
      <div id="play-list">
        <div id="p-list">
          <ul className="list">
            {playList
              .filter(f => f.Name.includes(filter.toLocaleLowerCase()))
              .map(item => (
                <li
                  id={item.Id}
                  key={item.Id}
                  className={"list-item " + (item.Id === fileId ? "active" : "")}
                  onClick={selectFile}
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
        <div className="p-controls">
          <label className="p-sort" htmlFor="p-hide">
            <i className="fas fa-angle-right"></i>
          </label>
          <div id="v-filter">
            <input
              type="text"
              placeholder="Filter"
              className="form-control"
              onChange={filterPlayList}
            />
            <span className="clear-filter" onClick={clearFilter}>
              <i className="fas fa-times-circle"></i>
            </span>
          </div>
          <span id="p-items">{`${playList.findIndex(i => i.Id === fileId) + 1}/${
            playList.length
          }`}</span>
        </div>
      </div>
    </Fragment>
  );
};

export default PlayList;
