import React from "react";

const ModalRemove = ({ file, setShowModal, callBack }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    callBack(file.Id);
    console.log("file Remove");
  };

  return (
    <div className="moda-container">
      <div className="modal card bg-dark">
        <div className="modal-header">
          <h3>Remove Folder</h3>
        </div>
        <form action="#" onSubmit={handleSubmit}>
          <div className="modal-body">
            <h3 className="text-danger">Are you sure, you want to remove {file.Name}</h3>
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
            <button className="btn">Remove</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalRemove;
