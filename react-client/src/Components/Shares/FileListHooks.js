import { useEffect, useState, useRef, useContext, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { genUrl, PageTitles } from "./utils";
import { PageConfigContext } from "../../Context/PageConfigContext";

const cancelToken = axios.CancelToken;
var cancel;

const FileListHooks = ({ id, history, type }) => {
  const pageConfig = useContext(PageConfigContext);

  let cStatus = useRef(true);
  let { page, filter } = useParams();
  const [filesData, setFilesData] = useState({
    files: [],
    totalPages: 0,
    totalFiles: 0,
    isloading: true
  });
  useEffect(() => {
    return () => {
      cStatus.current = false;
    };
  }, []);
  useEffect(() => {
    if (cancel) {
      cancel();
    }
    axios
      .get(genUrl(page, pageConfig, filter, type, false, id), {
        cancelToken: new cancelToken(function executor(c) {
          cancel = c;
        })
      })
      .then(({ data }) => {
        if (cStatus.current) {
          if (data.files) {
            setFilesData({ ...data, isloading: false });
          } else {
            setFilesData({
              files: [],
              isloading: false
            });
          }
        }
      })
      .catch(err => {
        console.log("canceled");
      });
  }, [page, pageConfig, filter, type, id]);

  const pushHistory = useCallback(
    (pg, fltr, tid) => {
      history.push(genUrl(pg, pageConfig, fltr, type, true, tid));
    },
    [pageConfig, type, history]
  );

  const goToPage = pg => {
    pg = pg < 1 ? 1 : pg > filesData.totalPages ? filesData.totalPages : pg;
    if (pg !== page) {
      pushHistory(pg, filter, id);
    }
    return pg;
  };

  const fileFilter = useCallback(() => {
    let input = document.getElementById("filter-file");
    let fltr = input && input.value;
    pushHistory(1, fltr, id);
  }, [id, pushHistory]);

  const processFile = e => {
    let file = e.target.closest(".file");
    switch (file.dataset.type) {
      case "Manga": {
        break;
      }
      case "Video": {
        let tdata = history.location.pathname.split("/");
        let playType = tdata[1];
        let id = tdata[2];
        let url = `/viewer/`;

        if (["folder-content", "favorites"].includes(playType)) {
          url += `${playType.replace("-content", "")}/${id}/${file.id}`;
        } else {
          url += `video/${file.id}`;
        }

        history.push(url, { fileId: file.id });
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
    if (filesData.files.length > 0) {
      let firstEl;
      // get last selected element base on if we was an a folder or refreshing the page
      let folder = window.local.getObject("folder");
      firstEl = document.getElementById(folder ? folder.folder : "");

      if (type.includes("folders") && folder && folder.folder && firstEl) {
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

  document.title =
    PageTitles[type] + (page > 1 ? ` ${page} of ${filesData.totalPages}` : "");
  return {
    page: page || 1,
    filter: filter || "",
    filesData,
    setFilesData,
    goToPage,
    fileFilter,
    processFile
  };
};

export default FileListHooks;
