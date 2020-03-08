import React, { useState, useEffect } from "react";

import Files from "./Files";
import FileFilter from "./FileFilter";
import Pagination from "./Pagination";
import FileOrder from "./FileOrder";

import { loadFiles } from "./Fileloader";

const Videos = () => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [orderby, setOrderBy] = useState("nu");
  const [pagedata, setPageData] = useState({
    files: [],
    totalPages: 0,
    totalFiles: 0
  });

  const goToPage = pg => {
    if (pg > 0 && pg !== page && pg < pagedata.totalPages) setPage(pg);
  };

  const fileFilter = filter => {
    setFilter(filter);
  };
  const changeOrder = order => {
    setOrderBy(order);
  };
  useEffect(() => {
    console.log("file changes");
    loadFiles(page, orderby, "videos").then(data => {
      setPageData(data);
    });
  }, [page, orderby, filter]);

  useEffect(() => {
    let firstEl = document.querySelector(".file");
    if (firstEl) {
      firstEl.focus();
      firstEl.classList.add("active");
    }
  });

  return (
    <React.Fragment>
      <div id="files-list">
        {pagedata.files.length === 0 ? (
          <div></div>
        ) : (
          <Files files={pagedata.files} type="videos" />
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
        <FileOrder order={orderby} changeOrder={changeOrder} />
      </div>
    </React.Fragment>
  );
};

export default Videos;
