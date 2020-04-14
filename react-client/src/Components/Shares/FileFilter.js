import React, { useState, useEffect } from "react";

const FileFilter = ({ fileFilter, filter, showback, exitFolder }) => {
  const [localFilter, setLocalFilter] = useState(filter || "");
  const clearSearch = () => {
    document.getElementById("filter-file").value = "";
    fileFilter("");
  };

  const submitFilter = e => {
    if (e.keyCode === 13) {
      fileFilter(e.target.value);
    }
  };
  useEffect(() => {
    setLocalFilter(filter);
  }, [setLocalFilter, filter]);

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
        value={localFilter}
        onChange={e => {
          setLocalFilter(e.target.value);
        }}
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
