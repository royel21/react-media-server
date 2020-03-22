import React, { useEffect, useState } from "react";
import TreeItem from "./TreeItem";

import { animated as anin, useSpring } from "react-spring";

var loading = false;
var data;

const findItem = (data, id) => {
  for (let item of data) {
    if (item.Id === id) {
      return item;
    }
    if (item.Content.length > 0) {
      let found = findItem(item.Content, id);
      if (found) return found;
    }
  }
};

const TreeView = ({ socket }) => {
  const props = useSpring({ opacity: 1, from: { opacity: 0 } });
  const [treeData, setTreeData] = useState({
    data: [],
    isLoading: true
  });
  data = treeData.data;
  useEffect(() => {
    delete socket._callbacks[`$disk-loaded`];
    delete socket._callbacks[`$content-loaded`];
    socket.on("disk-loaded", data => {
      setTreeData({ data, isLoading: false });
    });
    socket.on("content-loaded", result => {
      if (result) {
        const tfound = findItem(data, result.Id);
        if (tfound) {
          tfound.Content = result.data;
        }
        setTreeData({ data, isLoading: false });
      }
      loading = false;
    });
    socket.emit("load-disks");
  }, []);

  const scanFolder = e => {
    if (loading) return;
    loading = true;

    const id = e.target.closest("li").id;
    const found = findItem(data, id);

    if (found.Content.length > 0) {
      found.Content = [];
      setTreeData({ data: data, isLoading: false });
      loading = false;
    } else {
      socket.emit("load-content", { Path: found.Path, Id: found.Id });
    }
  };

  return (
    <anin.div id="tab-disk" style={props}>
      <div className="tree-title">
        <i className="fas fa-server"></i>
        <span className="tree-name"> Server</span>
      </div>
      <ul className="tree-view">
        <TreeItem data={data} scanFolder={scanFolder} type="hdd" />
      </ul>
    </anin.div>
  );
};

export default TreeView;
