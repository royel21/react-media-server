import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Files from "./Files";

import { loadFiles } from "./Fileloader";
import FileFilter from "./FileFilter";
import Pagination from "./Pagination";
import FileOrder from "./FileOrder";

const Mangas = ({ history }) => {
  let params = useParams();
  const [orderby, setOrderBy] = useState(params.order || "nu");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState(params.filter || "");
  const [pagedata, setPageData] = useState({
    files: [],
    totalPages: 0,
    totalFiles: 0
  });

  if (page !== params.page) {
    setPage(params.page);
  }

  const goToPage = pg => {
    if (pg > 0 && pg !== page && pg < pagedata.totalPages) {
      setPage(pg);
      let url = `/mangas/${orderby}/${pg}/${filter || ""}`;
      //console.log(url, pg);
      history.push(url);
    }
  };

  const fileFilter = filter => {
    setFilter(filter);
  };

  const changeOrder = e => {
    setOrderBy(e.target.value);
  };

  useEffect(() => {
    loadFiles(page, orderby, "mangas").then(data => {
      setPageData(data);
    });
    document.title = "Mangas - " + page;
  }, [page, filter, orderby]);

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
          <Files files={pagedata.files} type="mangas" />
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

export default Mangas;
