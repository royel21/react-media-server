import React, { useState, Fragment } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";

import Files from "./Files";
import ModalEdit from "./ModalEdit";
import ModalRemove from "../Shares/RemoveModal";
const FolderList = ({
  history,
  mData,
  loadFiles,
  setCurrentFolder,
  folderId,
  setFoldersData,
  loadContent,
}) => {
  let { totalPages } = mData;
  let { page } = useParams();
  const [localFolder, setLocalFolder] = useState({});
  const [showModal, setShowModal] = useState({});

  const goToPage = (pg) => {
    let tpg = pg < 1 ? 1 : pg > totalPages ? totalPages : pg;
    if (pg > 0 && pg < totalPages + 1) history.push(`/admin/folders/${tpg}`);
    return pg;
  };

  const handleClick = (event) => {
    let elem = event.target;
    let Id = elem.closest("li").id;
    let cList = elem.classList.toString();

    if (/fa-edit|fa-trash/gi.test(cList)) {
      let folder = mData.files.find((f) => f.Id === Id);
      setLocalFolder(folder);
      if (/fa-edit/gi.test(cList)) {
        setShowModal({ Edit: true });
      } else {
        setShowModal({ Remove: true });
      }
    } else if (folderId !== Id) {
      setCurrentFolder(Id);
      loadFiles(1);
    }
  };

  const EditFile = (_file) => {
    let { Id, Name } = _file;
    let files = [...mData.files];
    let file = files.find((f) => f.Id === Id);

    if (Name === file.Name) return;

    Axios.post("/api/admin/folders/edit-folder", { Id, Name }).then(({ data }) => {
      if (data.success) {
        file.Name = Name;
        setFoldersData({ ...mData, files });
      }
    });
  };

  const removeFile = () => {
    let files = mData.files.filter((f) => f.Id !== localFolder.Id);
    let tempPage = page;
    Axios.delete("/api/admin/folders/remove-folder", {
      data: { Id: localFolder.Id },
    }).then(({ data }) => {
      if (data.success) {
        if (files.length === 0 && page > 1) {
          tempPage = page - 1;
        }
        setShowModal({});
        loadContent(tempPage);
      }
    });
  };

  console.log("render Folder");
  return (
    <Fragment>
      {showModal.Edit ? (
        <ModalEdit file={localFolder} setShowModal={setShowModal} callBack={EditFile} />
      ) : (
        ""
      )}
      {showModal.Remove ? (
        <ModalRemove
          file={localFolder.Name}
          removeFile={removeFile}
          setShowModal={setShowModal}
          showSys={false}
        />
      ) : (
        ""
      )}
      <Files
        title="Folders"
        data={mData}
        goToPage={goToPage}
        page={page}
        folderId={folderId}
        handleClick={handleClick}
      />
    </Fragment>
  );
};

export default React.memo(FolderList);
