import React, { useContext } from "react";

import Files from "./Files";
import FileFilter from "../../Shares/FileFilter";
import Pagination from "../../Shares/Pagination";
import FileListHooks from "./FileListHooks";
import Loading from "./Loading";

import { fileClicks, fileKeypress } from "./FileEventsHandler";
import { PageTitles } from "./utils";

import { UserContext } from "../../Context/UserContext";

const FilesList = (props) => {
  const { config } = useContext(UserContext);
  const { page, filter, filesData, goToPage, fileFilter, processFile } = FileListHooks(
    props,
    config
  );
  const { files, totalFiles, totalPages } = filesData;

  return (
    <React.Fragment>
      {!filesData.isloading ? (
        files.length > 0 ? (
          <div
            className="files-list"
            onDoubleClick={(e) => processFile(e.target.closest(".file"))}
            onClick={(e) => {
              e.persist();
              fileClicks(e.target, processFile);
            }}
            onKeyDown={(e) => {
              e.persist();
              fileKeypress(e, page, goToPage, processFile);
            }}
          >
            <Files files={files} processFile={processFile} type={props.type} />
          </div>
        ) : (
          <div className="files-list loading">
            <h4>{`No ${PageTitles[props.type]} Available`}</h4>
          </div>
        )
      ) : (
        <Loading />
      )}
      <div className="controls">
        <FileFilter
          fileFilter={fileFilter}
          filter={filter}
          showback={props.showback}
          exitFolder={props.exitFolder}
        />
        <Pagination
          data={{
            goToPage,
            page,
            totalPages: totalPages,
          }}
        />
        <span className="badge badge-primary total-files">{totalFiles}</span>
      </div>
    </React.Fragment>
  );
};

export default FilesList;
