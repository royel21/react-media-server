import React, { Fragment, useState, useEffect, useRef } from "react";
import { formatTime } from "../Shares/utils";

const PlayList = ({ files, setFile, fileId }) => {
  const [filter, setFilter] = useState("");
  const observerRef = useRef();
  const listRef = useRef();
  const filterPlayList = (e) => {
    setFilter(e.target.value);
  };

  const clearFilter = () => {
    setFilter("");
  };
  const selectFile = (e) => {
    let li = e.target.closest("li");
    if (li) {
      setFile(li.id);
    }
  };
  useEffect(() => {
    document.getElementById(fileId).scrollIntoView();
  }, [fileId]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    let imgs = listRef.current.querySelectorAll("img");
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (let entry of entries) {
          let img = entry.target;
          if (entry.isIntersecting) {
            img.src = img.dataset.src;
          } else {
            img.src = "";
          }
        }
      },
      {
        root: listRef.current,
        rootMargin: "500px",
        threshold: 0,
      }
    );

    imgs.forEach((lazyImg) => {
      observerRef.current.observe(lazyImg);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [files]);

  return (
    <Fragment>
      <input type="checkbox" id="p-hide" defaultChecked={true} />
      <div id="play-list">
        <div id="p-list" ref={listRef}>
          <ul className="list">
            {files
              .filter((f) => f.Name.includes(filter.toLocaleLowerCase()))
              .map((item) => (
                <li
                  id={item.Id}
                  key={item.Id}
                  className={
                    "list-item" + (item.Id === fileId ? " active" : "") + ` ${item.Type}`
                  }
                  onClick={selectFile}
                >
                  <span className="cover">
                    <img data-src={item.Cover} src="" alt="" />
                    <span className="duration">
                      {item.Type.includes("Manga")
                        ? `${item.CurrentPos + 1}/${item.Duration}`
                        : formatTime(item.Duration)}
                    </span>
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
          <span id="p-items">{`${files.findIndex((i) => i.Id === fileId) + 1}/${
            files.length
          }`}</span>
        </div>
      </div>
    </Fragment>
  );
};

export default PlayList;
