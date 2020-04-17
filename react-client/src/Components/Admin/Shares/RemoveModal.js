import React, { useState } from "react";

const RemoveModal = ({ removeFile, setShowModal, file, showSys = true }) => {
  const [systemDel, setSystemDel] = useState(true);

  const setSystemDelCheck = (e) => {
    setSystemDel(e.target.checked);
  };

  return (
    <div className="modal-container">
      <div id="remove" className="modal card">
        <div className="modal-header">
          <h3>Remove File</h3>
        </div>
        <div className="modal-body">
          <p>
            Are you sure you want to remove
            <b className="text-danger"> {file}</b>
          </p>
          {showSys ? (
            <div className="second-ctrl input-group">
              <div className="input-group-prepend">
                <label className="input-group-text">Delete from server</label>
              </div>
              <input
                id="delete"
                type="checkbox"
                name="delete"
                checked={systemDel}
                onChange={setSystemDelCheck}
              />
              <label htmlFor="delete" className="form-control checkadult">
                <i className="fas fa-times"></i>
              </label>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={() => setShowModal({ Remove: false })}>
            Cancel
          </button>
          <button className="btn" onClick={() => removeFile(systemDel)}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveModal;
