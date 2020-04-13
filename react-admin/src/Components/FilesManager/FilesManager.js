import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";
import Pagination from "../Pagination";
import FileFilter from "../FileFilter";
import EditFileModal from "../Shares/EditFileModal";
import RemoveModal from "../Shares/RemoveModal";

import { SocketContext } from "../Context/SockectContext";

import "./FilesManager.css";

const getItems = () => {
  return parseInt((window.innerHeight - 150) / 41);
};

const FilesManager = (props) => {
  const socket = useContext(SocketContext);
  const { page, items, filter } = useParams();
  const filesRef = useRef({});
  const [showModal, setShowModal] = useState({
    file: {},
    Delete: false,
    Edit: false,
    SysDel: false,
  });
  const [filesData, setFilesData] = useState({
    files: [],
    totalPages: 0,
    totalFiles: 0,
    isLoading: true,
  });

  const getData = useCallback(
    (page) => {
      Axios.get(`/api/admin/files/${page || 1}/${getItems()}/${filter || ""}`).then(
        ({ data }) => {
          setFilesData({ ...data, isLoading: false });
        }
      );
    },
    [setFilesData, filter]
  );

  useEffect(() => {
    getData(page, filter, setFilesData);
  }, [page, filter, items, getData]);
  // Set up socket callback
  useEffect(() => {
    socket.on("file-removed", (data) => {
      const { files, page, filter } = filesRef.current;
      if (data.removed) {
        if (files.length === 1) {
          props.history.replace(
            `/admin/files/${page > 1 ? page - 1 : page}/${getItems()}/${filter}`
          );
        } else {
          getData(page, filter, setFilesData);
        }
        setShowModal({ Delete: false });
      } else {
        console.log(data);
      }
    });

    return () => {
      delete socket._callbacks["$file-removed"];
    };
  }, [getData, props.history, socket]);

  //Set files ref
  useEffect(() => {
    filesRef.current = { files: filesData.files, page, filter };
  });

  // Show Edit Or Remove Dialog
  const showEditOrRemove = (e) => {
    let tr = e.target.closest("tr");
    let f = filesData.files.find((tf) => tf.Id === tr.id);
    setShowModal({ ...showModal, file: f, [e.target.id]: true });
  };

  // Accpet remove file
  const acceptRemoveFile = (systemDel) => {
    socket.emit("remove-file", { Id: showModal.file.Id, Del: systemDel });
  };

  const fileFilter = useCallback(
    (flt) => {
      props.history.push(`/admin/files/1/${getItems()}${flt ? `/${flt}` : ""}`);
    },
    [props.history]
  );

  const goToPage = (pg = 1) => {
    pg = pg < 1 ? 1 : pg > filesData.totalPages ? filesData.totalPages : pg;
    props.history.push(`/admin/files/${pg}/${getItems()}${filter ? `/${filter}` : ""}`);
    return pg;
  };

  //Navigate Pages
  document.title = "Files Manager";
  return (
    <div id="fl-manager" className="card bg-dark manager">
      {showModal.Edit ? (
        <EditFileModal
          setShowModal={setShowModal}
          file={showModal.file}
          filesData={filesData}
          setFilesData={setFilesData}
        />
      ) : (
        ""
      )}
      {showModal.Delete ? (
        <RemoveModal
          setShowModal={setShowModal}
          removeFile={acceptRemoveFile}
          file={showModal.file.Name}
        />
      ) : (
        ""
      )}
      <div className="controls">
        <FileFilter fileFilter={fileFilter} filter={filter} />
        {filesData.totalPages > 0 ? (
          <Pagination
            {...props}
            totalPages={filesData.totalPages}
            goToPage={goToPage}
            page={page}
          />
        ) : (
          ""
        )}
        <span className="badge badge-primary">Files: {filesData.totalFiles}</span>
      </div>
      <table className="table table-dark table-hover table-bordered">
        <thead>
          <tr>
            <th>Actions</th>
            <th>Name</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {filesData.files.length > 0 ? (
            filesData.files.map((f) => (
              <tr id={f.Id} key={f.Id}>
                <td>
                  <span id="Edit" onClick={showEditOrRemove}>
                    <i className="fas fa-edit"></i>
                  </span>
                  <span id="Delete" className="ml-2" onClick={showEditOrRemove}>
                    <i className="fas fa-trash-alt"></i>
                  </span>
                </td>
                <td data-path={f.FullPath}>{f.Name}</td>
                <td>{f.ViewCount}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">
                {filesData.isLoading
                  ? "Loading Data From Server"
                  : "No files found in the server"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FilesManager;
