import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { genUrl, PageTitles } from "./utils";

const FileListHooks = ({ id, history, type }, pageConfig) => {
  let { page, filter } = useParams();
  const [pagedata, setPageData] = useState({
    files: [],
    totalPages: 0,
    totalFiles: 0,
    favorities: []
  });

  useEffect(() => {
    axios(genUrl(page, pageConfig, filter, type, false, id)).then(({ data }) => {
      setPageData(data);
    });
  }, [page, pageConfig, filter, type, id]);

  const pushHistory = (pg, fltr, tid) => {
    history.push(genUrl(pg, pageConfig, fltr, type, true, tid));
  };

  const goToPage = pg => {
    if (pg !== page && pg > 0 && pg < pagedata.totalPages + 1) {
      pushHistory(pg, filter, id);
    }
    return pg;
  };

  const fileFilter = () => {
    let input = document.getElementById("filter-file");

    let fltr = input && input.value;
    pushHistory(1, fltr, id);
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
        window.local.setObject("folder", {
          folder: file.id,
          pathname: window.location.pathname
        });
        history.push(`/folder-content/${file.id}/1`);
      }
    }
  };

  useEffect(() => {
    if (pagedata.files.length) {
      // get last selected element base on if we was an a folder or refreshing the page
      let folder = window.local.getObject("folder");
      let selected = parseInt(window.local.getItem("selected"));

      let firstEl =
        document.getElementById(folder ? folder.folder : "") ||
        document.querySelectorAll(".file")[selected || 0];
      /**********************************************************/
      if (firstEl) {
        let lastActiveEl = document.querySelector("#files-list .active");
        if (lastActiveEl) firstEl.classList.remove("active");

        firstEl.focus();
        firstEl.classList.add("active");
      }
    }
    document.title = PageTitles[type] + (page > 1 ? ` ${page} of ${pagedata.totalPages}` : "");
  });

  return {
    page: page || 1,
    filter: filter || "",
    pagedata,
    goToPage,
    fileFilter,
    processFile
  };
};

export default FileListHooks;
