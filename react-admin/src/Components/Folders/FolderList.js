import React, { useState, Fragment } from "react";
import Files from "./Files";
import ModalEdit from "./ModalEdit";

import { useParams } from "react-router-dom";
import ModalRemove from "../Shares/RemoveModal";
import Axios from "axios";

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
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalRemove, setShowModalRemove] = useState(false);

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
        setShowModalEdit(true);
      } else {
        setShowModalRemove(true);
      }
    } else if (folderId !== Id) {
      setCurrentFolder(Id);
      loadFiles(1);
    }
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
        setShowModalRemove(false);
        loadContent(tempPage);
      }
    });
  };

  console.log("render Folder", mData);
  return (
    <Fragment>
      {showModalEdit ? (
        <ModalEdit file={localFolder} setShowModal={setShowModalEdit} />
      ) : (
        ""
      )}
      {showModalRemove ? (
        <ModalRemove
          file={localFolder.Name}
          removeFile={removeFile}
          setShowModal={setShowModalRemove}
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
