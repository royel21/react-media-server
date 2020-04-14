import React, { useEffect, useState } from "react";
import TreeItem from "./TreeItem";

import { animated as anin, useSpring } from "react-spring";

const TreeView = ({ socket }) => {
  const props = useSpring({ opacity: 1, from: { opacity: 0 } });
  const [treeData, setTreeData] = useState({
    data: [],
    isLoading: true
  });

  const [eventMsg, setEventMsg] = useState({ bg: "", msg: "" });

  useEffect(() => {
    socket.on("disk-loaded", data => {
      setTreeData({ data, isLoading: false });
    });
    socket.emit("load-disks");

    return () => {
      delete socket._callbacks["$disk-loaded"];
    };
  }, [socket]);

  return (
    <anin.div id="tab-disk" style={props}>
      <div className="tree-title">
        <i className="fas fa-server"></i>
        <span className="tree-name"> Server</span>
      </div>
      <div className={"event-msg " + eventMsg.bg}>{eventMsg.msg}</div>
      <ul className="tree-view">
        {treeData.data.length > 0 ? (
          <TreeItem
            data={treeData.data}
            type="hdd"
            setEventMsg={setEventMsg}
            socket={socket}
          />
        ) : (
          ""
        )}
      </ul>
    </anin.div>
  );
};

export default TreeView;
