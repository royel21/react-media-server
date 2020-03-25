import React, { useContext } from "react";

import Files from "./Files";
import FileFilter from "./FileFilter";
import Pagination from "./Pagination";
import FileListHooks from "./FileListHooks";

import { fileNavKeydown, fileNavClick } from "../KeyboardNav";
import { PageTitles } from "./utils";

import { PageConfigContext } from "../../Context/PageConfigContext";

const FilesList = props => {
  const { pageConfig } = useContext(PageConfigContext);
  const { page, filter, filesData, goToPage, fileFilter, processFile } = FileListHooks(
    props,
    pageConfig
  );
  const { files, totalFiles, totalPages } = filesData;

  return (
    <React.Fragment>
      {!filesData.isloading ? (
        files.length > 0 ? (
          <div
            id="files-list"
            onClick={fileNavClick}
            onKeyDown={e => {
              fileNavKeydown(e, page, pageConfig.items, goToPage);
            }}
          >
            <Files files={files} processFile={processFile} type={props.type} />
          </div>
        ) : (
          <div id="files-list" className="loading">
            <h3>{`No ${PageTitles[props.type]} Available`}</h3>
          </div>
        )
      ) : (
        <div id="files-list" className="loading">
          <div className="loading">
            <h3>Loading...</h3>
            <div className="lds-ring">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
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
            totalFiles: totalFiles,
            totalPages: totalPages
          }}
        />
        <span className="badge badge-primary total-files">{totalFiles}</span>
      </div>
    </React.Fragment>
  );
};

export default FilesList;
