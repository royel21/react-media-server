import React, {
  useEffect,
  useState,
  Fragment,
  useRef,
  useCallback,
} from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";

import "./Viewer.css";
// Components
import VidePlayer from "./VideoPlayer";
import PlayList from "./PlayList";
import Loading from "../Shares/Loading";
// Utils
import { setfullscreen } from "../Shares/utils";
import { KeyMap, handleKeyboard } from "./KeyMap";

const TypeList = ["folder", "favorite"];

const Viewer = (props) => {
  const viewRef = useRef(null);
  const { type, id, fileId } = useParams();

  const [viewerData, setViewerData] = useState({
    files: [],
    isLoading: true,
    config: {},
  });
  let file = {};

  useEffect(() => {
    Axios.post(`/api/videos/${type}`, { id }).then(({ data }) => {
      if (data.fail) {
        console.log(data.msg);
      } else {
        if (TypeList.includes(type)) {
          setViewerData({ ...data, isLoading: false });
        } else {
          setViewerData({ ...data, isLoading: false });
        }
      }
    });
  }, [type, id]);

  if (viewerData.files.length > 0) {
    file = viewerData.files.find((tf) => tf.Id === fileId) || {};
  } else {
    file = viewerData.file || {};
  }

  const goToFile = (file) => {
    props.history.push(`/viewer/${type}/${id}/${file}`);
  };
  const prevOrNextFile = (pos) => {
    let data = viewerData.files;
    let fileIndex = data.findIndex((f) => f.Id === fileId) + pos;
    if (fileIndex > -1 && fileIndex < data.length) {
      goToFile(data[fileIndex].Id);
    }
  };

  const updateFile = (f) => {
    let data = { ...viewerData };
    let ff = data.files.find((of) => of.Id === f.Id);
    ff.CurrentPos = f.CurrentPos;
    setViewerData(data);
  };
  const nextFile = (f) => {
    if (f) updateFile(f);
    prevOrNextFile(1);
  };

  const prevFile = (f) => {
    if (f) updateFile(f);
    prevOrNextFile(-1);
  };

  const handleClick = (e) => {
    // let listControl = document.getElementById("p-hide");
    // if (e.target.tagName === "VIDEO") {
    //   listControl.checked = true;
    // }
  };

  const fullSreenChange = useCallback(
    (e) => {
      if (
        /(android)|(iphone)/i.test(navigator.userAgent) &&
        file.Type.includes("Video")
      ) {
        if (document.fullscreenElement === viewRef.current) {
          window.screen.orientation.lock("landscape");
          console.log("isAndroid");
        } else {
          window.screen.orientation.unlock();
          console.log("isAndroid not");
        }
      }
    },
    [file.Type]
  );

  const setFullViewerScreen = () => {
    setfullscreen(document.getElementById("viewer"));
  };

  useEffect(() => {
    if (viewRef.current) {
      viewRef.current.focus();
    }
    document.addEventListener("fullscreenchange", fullSreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", fullSreenChange);
    };
  }, [fullSreenChange, viewRef]);

  useEffect(() => {
    console.log("update-recentf", fileId, id);
    if (fileId) {
      window.socket.emit("update-recentf", {
        id,
        fileId,
      });
    }
  }, [fileId, id]);

  KeyMap.Fullscreen.action = setFullViewerScreen;
  KeyMap.PrevFile.action = prevFile;
  KeyMap.NextFile.action = nextFile;

  return (
    <Fragment>
      {viewerData.isLoading ? (
        <Loading />
      ) : (
        <div
          id="viewer"
          onClick={handleClick}
          ref={viewRef}
          onKeyDown={handleKeyboard}
          tabIndex={0}
        >
          <div id="clock"></div>
          <VidePlayer
            configMedia={viewerData.config.video}
            file={file}
            btnlist={fileId}
            prevFile={prevFile}
            nextFile={nextFile}
            setFullscreen={setFullViewerScreen}
          />
          {viewerData.files.length > 0 ? (
            <PlayList
              fileId={fileId}
              setFile={goToFile}
              files={viewerData.files}
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
