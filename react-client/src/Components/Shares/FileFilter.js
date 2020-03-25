import React from "react";

const FileFilter = ({ fileFilter, filter, showback, exitFolder }) => {
  const clearSearch = () => {
    document.getElementById("filter-file").value = "";
    fileFilter("");
  };

  const submitFilter = e => {
    if (e.keyCode === 13) {
      fileFilter(e.target.value);
    }
  };

  return (
    <div id="filter-control" className="input-group">
      {showback ? (
        <span className="badge badge-secondary mx-2" onClick={exitFolder}>
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

export default React.memo(FileFilter);
