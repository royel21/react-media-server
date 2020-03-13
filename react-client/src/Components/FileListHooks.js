import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { loadFiles } from "./Fileloader";

const FileListHooks = (history, type) => {
  let { page, order, filter } = useParams();

  let [filterState, setFilter] = useState("");
  let [orderState, setOrder] = useState("nu");

  const [pagedata, setPageData] = useState({
    files: [],
    totalPages: 0,
    totalFiles: 0
  });

  const pushHistory = (pg, odr, fltr) => {
    let url = `/${type}/${odr || "nu"}/${pg || 1}/${fltr || ""}`;
    setFilter(fltr);
    setOrder(odr || "nu");
    history.push(url);
  };

  const goToPage = pg => {
    if (pg !== page) {
      if (pg > pagedata.totalPages) {
        pg = pagedata.totalPages;
      } else if (pg < 1) {
        pg = 1;
      }
      pushHistory(pg, order, filter);
    }
  };

  const fileFilter = () => {
    let input = document.getElementById("filter-file");

    let fltr = input && input.value;
    pushHistory(1, orderState, fltr);
  };

  const changeOrder = e => {
    pushHistory(page, e.target.value, filterState);
  };

  useEffect(() => {
    loadFiles(page, order, filter, type).then(data => {
      setPageData(data);
    });
  }, [page, order, filter, type]);

  useEffect(() => {
    let firstEl = document.querySelector(".file");
    if (firstEl) {
      firstEl.focus();
      firstEl.classList.add("active");
    }
    document.title = type.includes("mangas") ? "Mangas" : "Videos";
  });

  return {
    order,
    page: page || 1,
    filter: filter || "",
    goToPage,
    fileFilter,
    changeOrder,
    pagedata
  };
};

export default FileListHooks;
