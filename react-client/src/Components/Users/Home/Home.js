import React, { useState, useEffect } from "react";
import Files from "../../Shares/Files";
import { fileKeypress, fileClicks } from "../../Shares/FileEventsHandler";
import { getFilesPerPage } from "../../Shares/utils";

import "./Home.css";
import Axios from "axios";

const Home = ({ history }) => {
  const [recents, setRecents] = useState({
    files: [],
    folders: [],
  });

  useEffect(() => {
    Axios.get("/api/users/userconfig").then(({ data }) => {
      if (data.recentFolders) {
        setRecents({
          folders: data.recentFolders,
        });
      }
    });
  }, [setRecents]);

  const processFile = (file) => {
    localStorage.setItem("lastLoc", history.location.pathname);
    switch (file.dataset.type) {
      case "Manga": {
        break;
      }
      case "Video": {
        break;
      }
      default: {
        let folder = recents.folders.find((f) => f.Id === file.id);
        history.push(`/viewer/folder/${folder.Id}/${folder.FileId}`);
      }
    }
  };
  document.title = "Home";
  return (
    <React.Fragment>
      <div id="home-file">
        <div className="home-title">
          <span>Last View Folders</span>
        </div>
        <div
          className="files-list"
          style={{ maxHeight: 540, padding: 0 }}
          onClick={(e) => {
            e.persist();
            fileClicks(e.target, processFile);
          }}
          onKeyDown={(e) => {
            e.persist();
            fileKeypress(e, null, null, processFile);
          }}
          onDoubleClick={processFile}
        >
          <Files files={recents.folders.slice(0, getFilesPerPage(2))} type="folders" />
        </div>
      </div>
    </React.Fragment>
  );
};

export default Home;
