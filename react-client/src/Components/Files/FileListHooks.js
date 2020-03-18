import { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { genUrl, PageTitles } from "./utils";
import { FilesContext } from "../../Context/FilesContext";

const FileListHooks = ({ id, history, type }, pageConfig) => {
  let { page, filter } = useParams();
  const { filesData, setFilesData } = useContext(FilesContext);
  const { files, totalPages } = filesData;

  useEffect(() => {
    axios(genUrl(page, pageConfig, filter, type, false, id)).then(({ data }) => {
      setFilesData(data);
    });
  }, [page, pageConfig, filter, type, id, setFilesData]);

  const pushHistory = (pg, fltr, tid) => {
    history.push(genUrl(pg, pageConfig, fltr, type, true, tid));
  };

  const goToPage = pg => {
    pg = pg < 1 ? 1 : pg > totalPages + 1 ? totalPages : pg;
    if (pg !== page) {
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
    if (files.length > 0) {
      let firstEl;
      // get last selected element base on if we was an a folder or refreshing the page
      let folder = window.local.getObject("folder");
      firstEl = document.getElementById(folder ? folder.folder : "");

      if (type.includes("folders") && folder.folder && firstEl) {
        window.local.setObject("folder", {
          selected: "",
          pathname: ""
        });
      } else {
        let selected = parseInt(window.local.getItem("selected"));
        firstEl = document.querySelectorAll(".file")[selected || 0];
      }

      /**********************************************************/
      if (firstEl) {
        let lastActiveEl = document.querySelector("#files-list .active");
        if (lastActiveEl) firstEl.classList.remove("active");

        firstEl.focus();
        firstEl.classList.add("active");
      }
    }
  });

  document.title = PageTitles[type] + (page > 1 ? ` ${page} of ${totalPages}` : "");
  return {
    page: page || 1,
    filter: filter || "",
    goToPage,
    fileFilter,
    processFile
  };
};

export default FileListHooks;
