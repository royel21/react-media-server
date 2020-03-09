import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Files from "./Files";

import { loadFiles } from "./Fileloader";
import FileFilter from "./FileFilter";
import Pagination from "./Pagination";
import FileOrder from "./FileOrder";

const Mangas = ({ history, type }) => {
  let params = useParams();
  const [orderby, setOrderBy] = useState(params.order || "nu");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState(params.filter || "");
  const [fileType, setFileType] = useState(type || "");
  const [pagedata, setPageData] = useState({
    files: [],
    totalPages: 0,
    totalFiles: 0
  });
  if (fileType !== type) {
    setFileType(type);
    console.log(page, filter, fileType);
  }
  const pushHistory = (pg, odr, fltr) => {
    setFilter(fltr);
    setPage(pg);
    setOrderBy(odr);
    let url = `/${type}/${odr}/${pg}/${fltr || ""}`;
    history.push(url);
  };
  // if ((params.page || page > 1) && page !== params.page) {
  //   setPage(params.page || 1);
  //   setFilter("");
  // }

  const goToPage = pg => {
    if (pg !== page) {
      pushHistory(pg, orderby, filter);
    }
  };

  const fileFilter = filter => {
    console.log(filter);
    let input = document.getElementById("filter-file");

    let filter2 = input && input.value;
    pushHistory(page, orderby, filter2);
  };

  const changeOrder = e => {
    pushHistory(1, e.target.value, "");
  };

  useEffect(() => {
    console.log("load file");
    loadFiles(page, orderby, fileType, filter).then(data => {
      setPageData(data);
    });
  }, [page, filter, fileType, orderby]);

  useEffect(() => {
    let firstEl = document.querySelector(".file");
    if (firstEl) {
      firstEl.focus();
      firstEl.classList.add("active");
    }
    document.title = type.includes("mangas") ? "Mangas" : "Videos";
  });

  console.log("render", page);
  return (
    <React.Fragment>
      <div id="files-list">
        {pagedata.files.length === 0 ? (
          <div></div>
        ) : (
          <Files files={pagedata.files} type={fileType} />
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
