import React, { useEffect, useState, Fragment, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";

import "./Viewer.css";

import VidePlayer from "./VideoPlayer";
import PlayList from "./PlayList";
import Axios from "axios";
import Loading from "../Shares/Loading";
import { setfullscreen } from "../Shares/utils";
import { KeyMap, handleKeyboard } from "./KeyMap";

const TypeList = ["folder", "favorite"];

const Viewer = ({ location }) => {
  const viewRef = useRef(null);
  const { type, id } = useParams();
  const [fileId, setFileId] = useState(location.state.fileId);

  const [viewerData, setViewerData] = useState({
    playList: [],
    isLoading: true
  });
  let file = {};

  useEffect(() => {
    Axios.post(`/api/videos/${type}`, { id }).then(({ data }) => {
      if (data.fail) {
        console.log(data.msg);
      } else {
        if (TypeList.includes(type)) {
          setViewerData({ playList: data, isLoading: false });
        } else {
          setViewerData({ playList: [], file: data, isLoading: false });
        }
      }
    });
  }, [type, id]);

  if (viewerData.playList.length > 0) {
    file = viewerData.playList.find(tf => tf.Id === fileId) || {};
  } else {
    file = viewerData.file;
  }

  const prevOrNextFile = pos => {
    let data = viewerData.playList;
    let fileIndex = data.findIndex(f => f.Id === fileId) + pos;

    console.log(fileIndex);
    if (fileIndex > 0 && fileIndex < data.length) setFileId(data[fileIndex].Id);
  };

  const nextFile = () => {
    prevOrNextFile(1);
  };

  const prevFile = () => {
    prevOrNextFile(-1);
  };

  const handleClick = e => {
    // let listControl = document.getElementById("p-hide");
    // if (e.target.tagName === "VIDEO") {
    //   listControl.checked = true;
    // }
  };

  const fullSreenChange = useCallback(e => {
    if (
      document.fullscreenElement === viewRef.current &&
      /(android)|(iphone)/i.test(navigator.userAgent)
    ) {
      window.screen.orientation.lock("landscape");
      console.log("isAndroid");
    } else {
      window.screen.orientation.unlock();
      console.log("isAndroid not");
    }
  }, []);

  useEffect(() => {
    document.addEventListener("fullscreenchange", fullSreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", fullSreenChange);
    };
  }, [fullSreenChange]);

  const setFullViewerScreen = () => {
    setfullscreen(document.getElementById("viewer"));
  };

  KeyMap.Fullscreen.action = setFullViewerScreen;
  KeyMap.PrevFile.action = prevFile;
  KeyMap.NextFile.action = nextFile;

  return (
    <Fragment>
      {viewerData.isLoading ? (
        <Loading />
      ) : (
        <div id="viewer" onClick={handleClick} ref={viewRef} onKeyDown={handleKeyboard}>
          <VidePlayer
            file={file}
            btnlist={fileId}
            prevFile={prevFile}
            nextFile={nextFile}
            setFullscreen={setFullViewerScreen}
            auto={true}
          />
          {viewerData.playList.length > 0 ? (
            <PlayList
              fileId={fileId}
              setFile={setFileId}
              playList={viewerData.playList}
            />
          ) : (
            ""
          )}
        </div>
      )}
    </Fragment>
  );
};

export default Viewer;
