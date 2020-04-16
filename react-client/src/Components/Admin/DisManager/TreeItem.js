import React, { useState } from "react";
import Axios from "axios";

var loading = false;

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

const TreeItem = props => {
  const { data, type, socket, setEventMsg } = props;
  const [localData, setLocalData] = useState(data);

  const expandFolder = e => {
    if (loading) return;
    loading = true;
    const dataCopy = [...localData];
    const id = e.target.closest("li").id;
    const found = findItem(dataCopy, id);

    if (found.Content.length > 0) {
      found.Content = [];
      setLocalData(dataCopy);
      loading = false;
    } else {
      Axios.post("/api/admin/directories/content", { Path: found.Path }).then(
        ({ data }) => {
          let dir = findItem(dataCopy, found.Id);
          dir.Content = data.data;
          setLocalData(dataCopy);
          loading = false;
        }
      );
    }
  };

  const scanDir = e => {
    const id = e.target.closest("li").id;
    const found = findItem(localData, id);
    let event = { bg: "bg-success", msg: "Scanning " + found.Name };
    if (["C:\\", "/"].includes(found.Path)) {
      event.bg = "bg-danger";
      event.msg = "Can't scan system root";
    } else {
      socket.emit("scan-dir", { Path: found.Path });
    }
    setEventMsg(event);
  };

  return localData.map(d => (
    <li id={d.Id} key={d.Id} className="tree-item">
      <span className="dir" onClick={scanDir}>
        <i className={`fa fa-${type} mr-1`}></i>
        {d.Name}
      </span>
      <span className="caret" onClick={expandFolder}>
        ▶
      </span>
      {d.Content.length > 0 ? (
        <ul className="tree-node">
          <TreeItem
            data={d.Content}
            socket={socket}
            setEventMsg={setEventMsg}
            type="folder"
          />
        </ul>
      ) : (
        ""
      )}
    </li>
  ));
};

export default React.memo(TreeItem);
