import React from "react";
import Files from "./Files";
import FileFilter from "./FileFilter";
import Pagination from "./Pagination";
import FileOrder from "./FileOrder";
import FileListHooks from "./FileListHooks";

const FilesList = ({ history, type }) => {
  const {
    order,
    page,
    filter,
    goToPage,
    fileFilter,
    changeOrder,
    pagedata
  } = FileListHooks(history, type);
  return (
    <React.Fragment>
      <div id="files-list">
        {pagedata.files.length === 0 ? (
          <div></div>
        ) : (
          <Files files={pagedata.files} />
        )}
      </div>
      <div className="controls">
        <FileFilter fileFilter={fileFilter} filter={filter} />
        <Pagination
          data={{
            goToPage,
            page,
            totalFiles: pagedata.totalFiles,
            totalPages: pagedata.totalPages
          }}
        />
        {pagedata.totalPages > 0 ? (
          <FileOrder order={order} changeOrder={changeOrder} />
        ) : (
          ""
        )}
      </div>
    </React.Fragment>
  );
};

export default FilesList;
