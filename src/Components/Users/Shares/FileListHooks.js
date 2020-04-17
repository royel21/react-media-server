import { useEffect, useState, useRef, useContext, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { genUrl, PageTitles } from "./utils";
import { UserContext } from "../../Context/UserContext";
import { ProcessFile } from "./utils";

const cancelToken = axios.CancelToken;
var cancel;

const FileListHooks = ({ id, history, type }) => {
  const { config } = useContext(UserContext);

  let cStatus = useRef(true);
  let { page, filter } = useParams();
  const [filesData, setFilesData] = useState({
    files: [],
    totalPages: 0,
    totalFiles: 0,
    isloading: true,
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
      .get(genUrl(page, config, filter, type, false, id), {
        cancelToken: new cancelToken(function executor(c) {
          cancel = c;
        }),
      })
      .then(({ data }) => {
        if (cStatus.current) {
          if (data.files) {
            setFilesData({ ...data, isloading: false });
          } else {
            setFilesData({
              files: [],
              isloading: false,
            });
          }
        }
      })
      .catch((err) => {
        console.log("canceled");
      });
  }, [page, config, filter, type, id]);

  const pushHistory = useCallback(
    (pg, fltr, tid) => {
      history.push(genUrl(pg, config, fltr, type, true, tid));
    },
    [config, type, history]
  );

  const goToPage = (pg) => {
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

  useEffect(() => {
    if (filesData.files.length > 0) {
      let firstEl;
      // get last selected element base on if we was an a folder or refreshing the page
      let folder = window.local.getObject("folder");
      firstEl = document.getElementById(folder ? folder.folder : "");

      if (type.includes("folders") && folder && folder.folder && firstEl) {
        window.local.setObject("folder", {
          selected: "",
          pathname: "",
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
  const processFile = (e) => {
    ProcessFile(e, history);
  };

  document.title =
    PageTitles[type] + (page > 1 ? ` ${page} of ${filesData.totalPages}` : "");
  return {
    page: page || 1,
    filter: filter || "",
    filesData,
    setFilesData,
    goToPage,
    fileFilter,
    processFile,
  };
};

export default FileListHooks;
