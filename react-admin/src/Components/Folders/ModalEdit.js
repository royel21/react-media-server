import React, { useState } from "react";

const ModalEdit = ({ file, callBack, setShowModal }) => {
  const [localFile, setLocalFile] = useState(file);

  const onFileChange = (event) => {
    setLocalFile({ ...localFile, Name: event.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (callBack) callBack(localFile);
    setLocalFile(setLocalFile);
    setShowModal(false);
  };

  return (
    <div className="modal-container">
      <div className="modal card">
        <div className="modal-header">
          <h3>Edit Folder</h3>
        </div>
        <form action="#" onSubmit={handleSubmit}>
          <div className="modal-body">
            <input type="hidden" name="Id" value={file.Id} />
            <div className="input-group">
              <div className="input-group-prepend">
                <label htmlFor="Name" className="input-group-text">
                  Name
                </label>
              </div>
              <input
                type="text"
                className="form-control"
                value={localFile.Name}
                onChange={onFileChange}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn"
              onClick={() => {
                setShowModal(false);
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEdit;
