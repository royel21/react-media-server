import React from "react";

const FoldersManager = () => {
  document.title = "Folders Manager";
  return (
    <div id="fd-manager" className="card bg-dark manager">
      <div className="nav nav-tabs controls">
        <div className="nav-item">
          <input type="radio" name="d-tab" id="tab1" defaultChecked />
          <label className="nav-link" htmlFor="tab1">
            <i className="fas fa-folder"></i>
          </label>
        </div>
        <div className="nav-item">
          <input type="radio" name="d-tab" id="tab2" />
          <label className="nav-link" htmlFor="tab2">
            <div className="fas fa-hdd"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default FoldersManager;
