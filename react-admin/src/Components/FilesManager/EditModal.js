import React, { useState, useEffect } from "react";
import Axios from "axios";

const Modal = ({ filesData, setFilesData, file, setShowModal }) => {
  const [localFile, setLocalFile] = useState(file);
  const [error, setError] = useState("");

  const updateLocalUser = e => {
    let el = e.target;
    setLocalFile({
      ...localFile,
      Name: el.value
    });
  };

  const submit = e => {
    if (!localFile.Name) return setError("Name Can't be empty");
    Axios.post("/api/admin/files/edit", localFile).then(({ data }) => {
      if (!data.fail) {
        let files = [...filesData.files];

        let f = files.find(ft => ft.Id === file.Id);
        if (f) {
          f.Name = localFile.Name;
        }
        setFilesData({ ...filesData, files });

        setError("");
        setShowModal({ Edit: false });
      } else {
        setError(data.msg);
      }
    });
  };

  const closeModal = () => {
    setShowModal({ Edit: false });
  };

  useEffect(() => {
    setLocalFile(file);
  }, [file]);

  return (
    <div className="modal-container">
      <div className="modal card">
        <div className="modal-header">
          <h3>Edit File Name</h3>
        </div>
        <div className="modal-body">
          <input type="hidden" name="Id" value={localFile.Id} />
          <div className="input-group">
            <div className="input-group-prepend">
              <label htmlFor="Name" className="input-group-text">
                <i className="fas fa-file"></i>
              </label>
            </div>
            <input
              className="form-control"
              type="text"
              name="Name"
              value={localFile.Name}
              onChange={updateLocalUser}
              autoFocus
            />
          </div>
          {error ? <div className="errors">{error}</div> : ""}
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={closeModal}>
            Cancel
          </button>
          <button className="btn" onClick={submit}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
