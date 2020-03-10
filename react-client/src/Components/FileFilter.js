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

const FileFilter = ({ fileFilter, filter }) => {
  return (
    <div id="filter-control" className="input-group">
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
        defaultValue={filter.filter || ""}
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
