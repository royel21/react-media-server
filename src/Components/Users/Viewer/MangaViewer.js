import React, { useEffect, useContext, useRef, useCallback } from "react";
import "./MangaViewer.css";
import { useState } from "react";
import { SocketContext } from "../../Context/SockectContext";
import PageInput from "../../Shares/PageInput";
import { KeyMap, handleKeyboard } from "../../Shares/KeyMap";
import { useHistory } from "react-router-dom";
import { scrollInView, webtoonLoader } from "./Webtoon";
import useMangaGesture from "../hooks/useMangaGesture";

const IndexOfUndefined = function (arr, from, dir) {
  var i = from;
  while (true) {
    if (!arr[i]) {
      return i;
    }
    i += dir;
  }
};

// const toBase64 = (buff) => {
//   let t = "";
//   let n = new Uint8Array(buff);
//   let r = n.byteLength;
//   for (let i = 0; i < r; i++) {
//     t += String.fromCharCode(n[i]);
//   }
//   return btoa(t);
// };

const MangaViewer = ({ file: { Id, CurrentPos = 0, Duration } }) => {
  const history = useHistory();
  const { PrevFile, NextFile, Fullscreen } = KeyMap;
  let size = Duration;
  const socket = useContext(SocketContext);
  //States
  const [content, setContent] = useState([]);
  const [webtoon, setWebtoon] = useState(false);
  const [pageData, setPageData] = useState({
    page: CurrentPos,
    loading: true,
  });
  //References
  const contentRef = useRef([]);
  const loadingRef = useRef(true);
  const pageRef = useRef({ id: Id, pos: CurrentPos });
  const observer = useRef();
  const divRef = useRef();
  const scrollRef = useRef(false);
  //Copy content to ref

  const loadImages = useCallback(
    (pg, toPage, dir = 1) => {
      console.time("t");
      loadingRef.current = true;
      let i = IndexOfUndefined(contentRef.current, pg, dir, Duration);
      if (i >= Duration || i <= -1) return;
      if (dir < 0) {
        i = i - toPage;
        toPage = pg;
      }
      i = i < 0 ? 0 : i;
      socket.emit("loadzip-image", { Id, fromPage: i, toPage });
    },
    [socket, Id, Duration]
  );
  //Next File
  const prevFile = () => {
    PrevFile.action && PrevFile.action({ Id, CurrentPos: pageData.page });
  };
  //Next File
  const nextFile = () => {
    NextFile.action && NextFile.action({ Id, CurrentPos: pageData.page });
  };

  const { onTouchStart, onTouchMove, onTouchEnd } = useMangaGesture(nextFile, prevFile);

  const prevPage = () => {
    if (!webtoon) {
      let pg = pageData.page - 1;
      if (pg > -1) {
        pageRef.current.pos = pg;
        let loading = false;
        if (!contentRef.current[pg - 10] && !loadingRef.current) {
          loadImages(pg, 10, -1);
          loading = true;
        }
        setPageData({ loading, page: pg });
      } else {
        prevFile();
      }
    }
  };
  const nextPage = () => {
    if (!webtoon) {
      let pg = pageData.page + 1;
      if (pg < size) {
        pageRef.current.pos = pg;
        let loading = false;
        if (!contentRef.current[pg + 10] && !loadingRef.current) {
          loadImages(pg, 10);
          loading = true;
        }
        setPageData({ loading, page: pg });
      } else {
        nextFile();
      }
    }
  };

  const onProgressClick = (event) => {
    event.stopPropagation();
    PageInput(event.target, pageData.page, size, (nextPage) => {
      let pg = nextPage < 0 ? 0 : nextPage >= size ? size - 1 : nextPage;
      if (!loadingRef.current) {
        loadImages(pg - 5, 10);
        setPageData({ page: pg, loading: false });
      }
      pageRef.current.pos = pg;
      if (webtoon) {
        scrollRef.current = true;
        scrollInView(pageRef.current.pos);
      }
      return pg;
    });
  };

  const onCancelContextM = (e) => {
    e.preventDefault();
    return false;
  };

  if (!webtoon) {
    KeyMap.SkipForward.action = nextPage;
    KeyMap.SkipBack.action = prevPage;
  } else {
    KeyMap.SkipForward.action = null;
    KeyMap.SkipBack.action = null;
  }

  const onReturn = () => {
    let lastLoc = localStorage.getItem("lastLoc");
    if (lastLoc) history.push(lastLoc);
  };

  const saveFile = useCallback(() => {
    console.log("save");
    socket.emit("file-update-pos", pageRef.current);
  }, [socket]);

  useEffect(() => {
    saveFile();
    contentRef.current = [];
    socket.on("image-loaded", (data) => {
      if (!data.error) {
        // contentRef.current[data.page] = toBase64(data.img);
        contentRef.current[data.page] = data.img;
        if (data.page === CurrentPos) {
          setContent([...contentRef.current]);
          console.log("page-reload", data.page);
        }
      }
    });

    socket.on("m-finish", () => {
      console.log("finish");
      console.timeEnd("t");
      loadingRef.current = false;
      // if (!webtoon) {
      setContent([...contentRef.current]);
      // }
    });

    pageRef.current = { id: Id, pos: CurrentPos };

    if (socket._callbacks["$image-loaded"]) {
      console.time("t");
      socket.emit("loadzip-image", {
        Id,
        fromPage: CurrentPos - 5 < 0 ? 0 : CurrentPos - 5,
        toPage: 10,
      });
    }
    setPageData({ content: [], page: CurrentPos, loading: true });
    window.addEventListener("beforeunload", saveFile, { passive: true });
    return () => {
      window.addEventListener("loadzip-image", saveFile);
      delete socket._callbacks["$image-loaded"];
      delete socket._callbacks["$m-finish"];
    };
  }, [setPageData, socket, Id, CurrentPos, saveFile]);

  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect();
      console.log("disconectAll");
    }
    if (webtoon) {
      console.log("scoll a new");
      scrollRef.current = true;
      scrollInView(pageRef.current.pos, () => {
        webtoonLoader(
          observer,
          Duration,
          pageRef,
          divRef,
          loadImages,
          setPageData,
          contentRef,
          loadingRef
        );
      });
    }
  }, [webtoon, setPageData, loadImages, Duration]);

  let img = content[pageData.page] || "";
  const progress = `${parseInt(pageData.page) + 1}/${size}`;

  console.log("render", pageData.loading);
  return (
    <div id="manga-viewer" onKeyDown={handleKeyboard} tabIndex="0">
      <span className="fullscreen-progress">{progress}</span>
      <div className="viewer">
        <div
          className={"img-current " + (webtoon ? "webtoon-img" : "")}
          onMouseDown={onTouchStart}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onContextMenu={onCancelContextM}
          ref={divRef}
          tabIndex="0"
        >
          {!webtoon ? (
            <img src={img && "data:img/jpeg;base64, " + img} alt="" />
          ) : (
            Array(size)
              .fill()
              .map((_, i) => {
                let data = contentRef.current[i];
                let img = (data && "data:img/jpeg;base64, " + data) || "";
                let classN = (pageData.page === i && "current-img") || "";

                return <img className={classN} key={i} id={i} src={img} alt="" />;
              })
          )}
        </div>
      </div>
      <div className="controls">
        <span id="hide-player" onClick={onReturn}>
          <i className="far fa-times-circle popup-msg" data-title="Close"></i>
        </span>
        <span className="web-toon">
          <input
            type="checkbox"
            name=""
            id="webtoon"
            value={webtoon}
            onChange={() => {
              setWebtoon(!webtoon);
            }}
          />
          <label htmlFor="webtoon">
            {webtoon ? "List" : "Pages"} <i className="fas fa-eye" />
          </label>
        </span>
        <span className="prev-file" onClick={prevFile}>
          <i className="fa fa-backward"></i>
        </span>
        <span className="prev-page" onClick={prevPage}>
          <i className="fa fa-arrow-circle-left"></i>
        </span>
        <span
          className="current-page"
          onClick={onProgressClick}
          onKeyDown={(e) => {
            e.stopPropagation();
          }}
        >
          {progress}
        </span>
        <span className="next-page" onClick={nextPage}>
          <i className="fa fa-arrow-circle-right"></i>
        </span>
        <span className="next-page" onClick={nextFile}>
          <i className="fa fa-forward"></i>
        </span>
        <span className="btn-fullscr" onClick={Fullscreen.action}>
          <i className="fas fa-expand-arrows-alt popup-msg" data-title="Full Screen" />
        </span>
        <span>
          <label className="p-sort" htmlFor="p-hide">
            <i className="fas fa-list"></i>
          </label>
        </span>
      </div>
    </div>
  );
};

export default MangaViewer;
