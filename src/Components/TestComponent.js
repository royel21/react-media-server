import React, { useEffect, useContext, useRef, useCallback } from "react";
import "./TestComponent.css";
import { useState } from "react";
import { SocketContext } from "./Context/SockectContext";
import PageInput from "./Shares/PageInput";
import { KeyMap, handleKeyboard } from "./Shares/KeyMap";

const IndexOfUndefined = function (arr, from, dir) {
  var i = from;
  if (from < 0) return 0;

  while (true) {
    if (!arr[i] || !i) {
      return i;
    }
    i += dir;
  }
};

const TestComponent = ({ file }) => {
  let size = file.Duration;
  const socket = useContext(SocketContext);
  //References
  const contentRef = useRef([]);
  const loadingRef = useRef(false);
  const observer = useRef();
  const pageRef = useRef(400);
  //States
  const [page, setPage] = useState(pageRef.current);
  const [webtoon, setWebtoon] = useState(false);
  const [content, setContent] = useState([]);
  const firstObverser = useRef(true);
  const mouseRef = useRef(false);
  const imgContainerRef = useRef();
  //Copy content to ref

  const loadImages = useCallback(
    (pg, toPage, dir = 1) => {
      loadingRef.current = true;
      let i = IndexOfUndefined(contentRef.current, pg, dir);
      if (dir === -1) {
        i = i - 10;
      }
      socket.emit("loadzip-image", { Id: file.Id, fromPage: i, toPage });
    },
    [socket, file.Id]
  );

  const nextPage = () => {
    if (!webtoon) {
      let pg = page + 1;
      if (pg < size) {
        pageRef.current = pg;
        setPage(pg);
        if (!content[pg + 10] && pg + 10 < size && !loadingRef.current) {
          console.log("load more");
          loadImages(pg, 10);
        }
      }
    }
  };
  const prevPage = () => {
    if (!webtoon) {
      let pg = page - 1;
      if (pg > -1) {
        setPage(pg);

        if (page > 0 && !content[pg - 10] && !loadingRef.current) {
          loadImages(pg, 10, -1);
        }
        pageRef.current = pg;
      }
    }
  };

  const onProgressClick = (event) => {
    PageInput(event.target, page, file.Duration, (nextPage) => {
      let pg = nextPage < 0 ? 0 : nextPage > size ? size : nextPage;
      if (!loadingRef.current) {
        loadImages(pg - 5, 10);
        setPage(pg);

        if (webtoon) scrollInView(pg);
      }
      return pg;
    });
  };

  const handleMouseDown = (e) => {
    if (!webtoon) {
      if (e.button === 0) {
        nextPage();
      } else {
        prevPage();
      }
    }
    mouseRef.current = true;
    e.preventDefault();
  };

  const onCancelContextM = (e) => {
    e.preventDefault();
    return false;
  };

  const handleMouseUp = (e) => {
    // socket.emit("loadzip-image", {
    //   Id: file.Id,
    //   fromPage: pageRef.current - 4,
    //   toPage: 8,
    // });
    // scrollInView(pageRef.current);
  };

  const scrollInView = useCallback((num) => {
    firstObverser.current = true;
    let currentimg = document.querySelectorAll(".img-current img")[num];
    if (currentimg) {
      currentimg.scrollIntoView();
      let tout = setTimeout(() => {
        console.log("scrolling");
        clearTimeout(tout);
        firstObverser.current = false;
      }, 10);
    }
  }, []);

  useEffect(() => {
    socket.on("image-loaded", (data) => {
      if (!data.error) {
        contentRef.current[data.page] = data.img;
      }
    });
    socket.on("m-finish", () => {
      console.log("finish");
      firstObverser.current = true;
      setContent([...contentRef.current]);
      loadingRef.current = false;
      setPage(parseInt(pageRef.current));
    });

    if (socket._callbacks["$image-loaded"]) {
      socket.emit("loadzip-image", {
        Id: file.Id,
        fromPage: pageRef.current - 5,
        toPage: 10,
      });
    }
    return () => {
      delete socket._callbacks["$image-loaded"];
      delete socket._callbacks["$m-finish"];
    };
  }, [socket, file.Id]);

  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect();
    }

    if (webtoon) {
      let imgs = document.querySelectorAll(".img-current img");
      // let inView = [];
      let loadMore = false;
      var scrTout;
      if (!observer.current) {
        observer.current = new IntersectionObserver(
          (entries) => {
            if (entries.length < imgs.length) {
              let pg;
              for (let entry of entries) {
                if (!firstObverser.current && entry.isIntersecting) {
                  pg = parseInt(entry.target.id);

                  if (!contentRef.current[pg + (pg > pageRef.current ? 5 : -5)]) {
                    loadMore = true;
                  }
                }
              }
              console.log("page:", pg, loadMore, !loadingRef.current);

              if (scrTout) {
                clearTimeout(scrTout);
                loadingRef.current = false;
              }

              if (loadMore && !loadingRef.current) {
                loadMore = false;
                let curPage = pageRef.current;
                console.log("current:", pg, curPage);
                scrTout = setTimeout(() => {
                  if (pg > curPage) {
                    loadImages(pg, 8);
                  } else {
                    loadImages(pg - 8, 8);
                  }
                  clearTimeout(scrTout);
                  scrTout = null;
                }, 50);
              }

              if (pg) {
                pageRef.current = pg;
                console.log("currentP:", pageRef.current);
                let cP = document.querySelector(".current-page");
                if (cP) cP.textContent = `${pg} / ${size}`;
              }

              firstObverser.current = false;
            }
          },
          {
            root: imgContainerRef.current,
            rootMargin: window.innerHeight * 2 + "px",
            threshold: 0,
          }
        );
      }

      imgs.forEach((lazyImg) => {
        observer.current.observe(lazyImg);
      });
      if (!loadingRef.current) {
        scrollInView(pageRef.current);
      }

      if (loadingRef.current) {
        loadingRef.current = false;
      }
    } else {
      setPage(parseInt(pageRef.current));
    }
  }, [webtoon, setPage, loadImages, size, socket, file.Id, scrollInView]);
  if (!webtoon) {
    KeyMap.SkipForward.action = nextPage;
    KeyMap.SkipBack.action = prevPage;
  } else {
    KeyMap.SkipForward.action = null;
    KeyMap.SkipBack.action = null;
  }

  return (
    <div
      id="manga-viewer"
      className="card bg-dark"
      onKeyDown={handleKeyboard}
      tabIndex="0"
    >
      <div className="viewer">
        <div
          className={"img-current " + (webtoon ? "webtoon-img" : "")}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onContextMenu={onCancelContextM}
          ref={imgContainerRef}
          tabIndex="0"
        >
          {!webtoon ? (
            <img
              src={content[page] ? "data:img/jpeg;base64, " + content[page] : ""}
              alt=""
            />
          ) : (
            Array(file.Duration)
              .fill()
              .map((_, i) => {
                // if (!data) return "";
                let data = content[i];
                let img = data ? "data:img/jpeg;base64, " + data : "";
                return (
                  <img
                    className={page === i ? "current-img" : !data ? "empty-img" : ""}
                    key={i}
                    id={i}
                    src={img}
                    alt=""
                  />
                );
              })
          )}
        </div>
      </div>
      <div className="controls">
        <span className="web-toon">
          <input
            type="checkbox"
            name=""
            id="webtoon"
            value={webtoon}
            onChange={() => {
              firstObverser.current = true;
              setWebtoon(!webtoon);
            }}
          />
          <label htmlFor="webtoon">
            WebToon <i className="fas fa-check" />
          </label>
        </span>
        <span className="prev-file">
          <i className="fa fa-backward"></i>
        </span>
        <span className="prev-page" onClick={prevPage}>
          <i className="fa fa-arrow-circle-left"></i>
        </span>
        <span className="current-page" onClick={onProgressClick}>
          {`${parseInt(page) + 1}/${size}`}
        </span>
        <span className="next-page" onClick={nextPage}>
          <i className="fa fa-arrow-circle-right"></i>
        </span>
        <span className="next-page">
          <i className="fa fa-forward"></i>
        </span>
      </div>
    </div>
  );
};

export default TestComponent;
