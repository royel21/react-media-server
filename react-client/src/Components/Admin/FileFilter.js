import React, { useRef, useEffect } from "react";

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

  useEffect(() => {
    inputRef.current.focus();
  });

  return (
    <div id="filter-control" className="input-group">
      <div className="input-group-prepend">
        <span className="btn-filter input-group-text" onClick={btnFilter}>
          <i className="fas fa-search" />
        </span>
      </div>
      <input
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
