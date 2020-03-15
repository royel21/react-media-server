import React from "react";
import Files from "./Files";
import FileFilter from "./FileFilter";
import Pagination from "./Pagination";
import FileOrder from "./FileOrder";
import FileListHooks from "./FileListHooks";
import { fileNavKeydown, fileNavClick } from "../KeyboardNav";

const FilesList = props => {
  const {
    order,
    page,
    filter,
    itemsperpage,
    goToPage,
    fileFilter,
    changeOrder,
    pagedata,
    processFile
  } = FileListHooks(props);
  return (
    <React.Fragment>
      <div
        id="files-list"
        onClick={fileNavClick}
        onKeyDown={e => {
          fileNavKeydown(e, page, itemsperpage, goToPage);
        }}
      >
        <Files files={pagedata.files} processFile={processFile} />
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

export default FilesList;
