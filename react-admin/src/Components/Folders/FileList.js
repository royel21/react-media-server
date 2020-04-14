import React, { useState, Fragment, useEffect, useContext } from "react";

import Files from "./Files";
import EditFileModal from "../Shares/EditFileModal";
import ModalRemove from "../Shares/RemoveModal";
import { SocketContext } from "../Context/SockectContext";

const FileList = ({ mData, loadFiles, setFilesData }) => {
  let [filter, setFilter] = useState("");
  const socket = useContext(SocketContext);
  const [page, setPage] = useState(1);
  let totalPages = mData.totalFilePages;
  const [localFile, setLocalFile] = useState({});
  const [showModal, setShowModal] = useState({});

  const goToPage = (pg) => {
    pg = pg < 1 ? 1 : pg > totalPages ? totalPages : pg;
    setPage(pg);
    loadFiles(pg);
    return pg;
  };

  // Set up socket callback
  useEffect(() => {
    socket.on("file-removed", (data) => {
      if (data.removed) {
        let files = [...mData.files].filter((f) => f.Id !== localFile.Id);
        setFilesData({ ...mData, files });
      }
    });

    return () => {
      delete socket._callbacks["$file-removed"];
    };
  }, [localFile, mData, setFilesData, socket]);

  // Accpet remove file
  const removeFile = (systemDel) => {
    socket.emit("remove-file", { Id: showModal.file.Id, Del: systemDel });
  };

  const handleClick = (event) => {
    let elem = event.target;
    let Id = elem.closest("li").id;
    let cList = elem.classList.toString();
    let file = mData.files.find((f) => f.Id === Id);
    setLocalFile(file);
    if (/fa-edit/gi.test(cList)) {
      setShowModal({ Edit: true });
    } else {
      setShowModal({ Remove: true });
    }
  };

  const fileFilter = (flt) => {
    console.log(flt);
    setFilter(flt);
    loadFiles(1, flt);
  };

  return (
    <Fragment>
      {showModal.Edit ? (
        <EditFileModal
          setFilesData={setFilesData}
          filesData={mData}
          file={localFile}
          setShowModal={setShowModal}
        />
      ) : (
        ""
      )}
      {showModal.Remove ? (
        <ModalRemove
          file={localFile.Name}
          removeFile={removeFile}
          setShowModal={setShowModal}
          showSys={true}
        />
      ) : (
        ""
      )}
      <Files
        filter={filter}
        fileFilter={fileFilter}
        title="Files"
        data={mData}
        goToPage={goToPage}
        page={page}
        handleClick={handleClick}
      />
    </Fragment>
  );
};

export default React.memo(FileList);
