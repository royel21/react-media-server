import React from "react";
import Files from "./Files";
import FileFilter from "./FileFilter";
import Pagination from "./Pagination";
import FileOrder from "./FileOrder";
import FileListHooks from "./FileListHooks";

const Videos = ({ history, type }) => {
  const {
    order,
    page,
    filter,
    goToPage,
    fileFilter,
    changeOrder,
    pagedata
  } = FileListHooks(history, "videos");
  return (
    <React.Fragment>
      <div id="files-list">
        {pagedata.files.length === 0 ? (
          <div></div>
        ) : (
          <Files files={pagedata.files} type={"videos"} />
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
        <FileOrder order={order} changeOrder={changeOrder} />
      </div>
    </React.Fragment>
  );
};

export default Videos;
