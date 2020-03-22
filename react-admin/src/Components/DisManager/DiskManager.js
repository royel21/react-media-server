import React, { useState, useContext } from "react";

import TreeView from "./TreeView";
import DirectoriesList from "./DirectoriesList";

import "./DiskManager.css";

import { SocketContext } from "../Context/SockectContext";

const DiskManager = () => {
  const socket = useContext(SocketContext);
  const [tab, setTab] = useState("tab1");

  const switchTab = e => {
    setTab(e.target.id);
  };

  document.title = "Disk Manager";
  return (
    <div id="d-manager" className="card bg-dark text-light">
      <div className="nav nav-tabs" id="tab-directory">
        <div className="nav-item">
          <input
            type="radio"
            name="d-tab"
            id="tab1"
            defaultChecked
            onChange={switchTab}
          />
          <label className="nav-link" htmlFor="tab1">
            <i className="fas fa-folder"></i>
          </label>
        </div>
        <div className="nav-item">
          <input type="radio" name="d-tab" id="tab2" onChange={switchTab} />
          <label className="nav-link" htmlFor="tab2">
            <div className="fas fa-hdd"></div>
          </label>
        </div>
      </div>
      <div id="tabs-content">
        {tab.includes("tab1") ? (
          <DirectoriesList socket={socket} />
        ) : (
          <TreeView socket={socket} />
        )}
      </div>
    </div>
  );
};

export default DiskManager;
