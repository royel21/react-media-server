import React from "react";

const clearSearch = fileFilter => {
  document.getElementById("filter-file").value = "";
  fileFilter("");
};

const submitFilter = (e, fileFilter) => {
  if (e.keyCode === 13) {
    fileFilter(e.target.value);
  }
};

const backFromFolderContent = history => {
  let pathname = window.local.getObject("folder").pathname || "/folders";
  history.push(pathname);
};

const FileFilter = ({ fileFilter, filter, showback, history }) => {
  return (
    <div id="filter-control" className="input-group">
      {showback ? (
        <span
          className="badge badge-secondary mx-2"
          onClick={e => {
            backFromFolderContent(history);
          }}
        >
          <i className="fas fa-arrow-circle-left"></i>
        </span>
      ) : (
        ""
      )}
      <div className="input-group-prepend">
        <span className="btn-search input-group-text" onClick={fileFilter}>
          <i className="fa fa-search" />
        </span>
      </div>
      <input
        id="filter-file"
        type="text"
        className="form-control"
        placeholder="Filter"
        defaultValue={filter || ""}
        onKeyDown={e => {
          submitFilter(e, fileFilter);
        }}
      />
      <span
        id="clear-search"
        onClick={e => {
          clearSearch(fileFilter);
        }}
      >
        <i className="fas fa-times-circle" />
      </span>
    </div>
  );
};

export default FileFilter;
