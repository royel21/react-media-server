import React, { useState, useEffect, useRef, useCallback } from "react";

import FileList from "./FileList";
import FolderList from "./FolderList";

import "./FoldersManager.css";
import Axios from "axios";
import { useParams } from "react-router-dom";

const calRows = () => {
  let container = document.getElementById("fd-manager") || {};
  return parseInt((container.offsetHeight - 41) / 37) - 1;
};

const FoldersManager = ({ history }) => {
  const { page = 1 } = useParams();
  const folderIdRef = useRef("");

  const [foldersData, setFoldersData] = useState({
    files: [],
    totalPages: 0,
    items: 0,
  });

  const [filesData, setFilesData] = useState({
    files: [],
    totalPages: 0,
    items: 0,
  });

  const loadFiles = useCallback((pg) => {
    Axios.get(`/api/admin/folders/files/${folderIdRef.current}/${pg}/${calRows()}`).then(
      ({ data }) => {
        setFilesData({
          files: data.files,
          totalPages: data.totalFilePages,
          items: data.totalFiles,
        });
      }
    );
  }, []);

  const setCurrentFolder = useCallback((Id) => {
    folderIdRef.current = Id;
  }, []);

  const loadContent = useCallback((page) => {
    Axios.get(`/api/admin/folders/${page}/${calRows()}`)
      .then(({ data }) => {
        if (data.folders.length > 0) {
          folderIdRef.current = data.folders[0].Id;
        }
        setFoldersData({
          files: data.folders,
          totalPages: data.totalFolderPages,
          items: data.totalFolders,
        });
        setFilesData({
          files: data.files,
          totalPages: data.totalFilePages,
          items: data.totalFiles,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    loadContent(page);
  }, [page, loadContent]);

  document.title = "Folders Manager";
  return (
    <div id="fd-manager" className="card bg-dark manager">
      <div className="row m-0">
        <FolderList
          history={history}
          mData={foldersData}
          folderId={folderIdRef.current}
          setCurrentFolder={setCurrentFolder}
          loadFiles={loadFiles}
          setFoldersData={setFoldersData}
          loadContent={loadContent}
        />
        <FileList
          title="File List"
          mData={filesData}
          loadFiles={loadFiles}
          setFilesData={setFilesData}
        />
      </div>
    </div>
  );
};

export default FoldersManager;
