import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const toUpper = {
  mangas: "Mangas",
  videos: "Videos",
  folders: "Folders",
  "folder-content": "Folder-content"
};
var itemsperpage = 0;
const genUrl = (page, order, filter, type, notApi, id) => {
  itemsperpage = Math.floor(window.innerWidth / 200) * 3;
  let api = notApi ? "/" : "/api/files/";
  let hasItems = notApi ? "" : `${itemsperpage}/`;
  return (
    api +
    (id ? `folder-content/${id}` : type) +
    `/${order || "nu"}/${page || 1}/${hasItems}${filter || ""}`
  );
};

const FileListHooks = ({ history, type }) => {
  let { id, page, order, filter } = useParams();
  let [filterState, setFilter] = useState("");
  let [orderState, setOrder] = useState("nu");

  const [pagedata, setPageData] = useState({
    files: [],
    totalPages: 0,
    totalFiles: 0
  });

  useEffect(() => {
    let url = genUrl(page, order, filter, type, false, id);
    axios(url).then(({ data }) => {
      setPageData(data);
    });
  }, [page, order, filter, type, id]);

  const pushHistory = (pg, odr, fltr, tid) => {
    setFilter(fltr);
    setOrder(odr || "nu");
    history.push(genUrl(pg, odr, fltr, type, true, tid || id));
    if (type.includes("folders")) window.local.removeItem("folder");
  };

  const goToPage = pg => {
    if (pg !== page && pg > 0 && pg < pagedata.totalPages + 1) {
      pushHistory(pg, order, filter);
    }
    return pg;
  };

  const fileFilter = () => {
    let input = document.getElementById("filter-file");

    let fltr = input && input.value;
    pushHistory(1, orderState, fltr);
  };

  const changeOrder = e => {
    pushHistory(page, e.target.value, filterState);
  };

  const processFile = e => {
    let file = e.target.closest(".file");
    switch (file.dataset.type) {
      case "Manga": {
        break;
      }
      case "Video": {
        break;
      }
      default: {
        pushHistory(1, "nu", "", file.id);
        window.local.setItem("folder", file.id);
      }
    }
  };

  useEffect(() => {
    if (pagedata.files.length) {
      let folder = window.local.getItem("folder");
      let selected = parseInt(window.local.getItem("selected"));

      let firstEl =
        document.getElementById(folder) ||
        document.querySelectorAll(".file")[selected || 0];

      if (firstEl) {
        firstEl.focus();
        firstEl.classList.add("active");
      }
    }
    document.title =
      toUpper[type] + (page > 1 ? ` ${page} of ${pagedata.totalPages}` : "");
  });
  return {
    order,
    page: page || 1,
    filter: filter || "",
    pagedata,
    itemsperpage,
    goToPage,
    fileFilter,
    changeOrder,
    processFile
  };
};

export default FileListHooks;
