import React, { useState } from "react";

const ModalEdit = ({ file, postRoute, callBack, setShowModal }) => {
  const [localFile, setLocalFile] = useState(file);

  const onFileChange = (event) => {
    setLocalFile({ ...localFile, Name: event.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(localFile);
  };
  return (
    <div className="moda-container">
      <div className="modal card bg-dark">
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
              className="btn"
              onClick={() => {
                setShowModal(false);
              }}
            >
              Cancel
            </button>
            <button className="btn">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEdit;
