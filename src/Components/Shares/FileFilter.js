import React, { useRef, showback, exitFolder } from "react";

const FileFilter = ({ fileFilter, filter }) => {
  const inputRef = useRef(null);
  //Apply Filter

  const ClearFilter = () => {
    inputRef.current.value = "";
    fileFilter("");
  };

  const submitFilter = (e) => {
    if (e.keyCode === 13) {
      fileFilter(e.target.value);
    }
  };

  const btnFilter = () => {
    let filter = inputRef.current.value;
    fileFilter(filter);
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
        <span className="btn-filter input-group-text" onClick={btnFilter}>
          <i className="fas fa-search" />
        </span>
      </div>
      <input
        id="filter-file"
        type="text"
        className="form-control filter-file"
        placeholder="Filter"
        defaultValue={filter || ""}
        onKeyDown={submitFilter}
        ref={inputRef}
      />
      <span id="clear-filter" onClick={ClearFilter}>
        <i className="fas fa-times-circle" />
      </span>
    </div>
  );
};

export default React.memo(FileFilter);
