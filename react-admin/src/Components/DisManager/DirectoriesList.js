import React, { useState, useEffect, useRef } from "react";
import { animated as anin, useSpring } from "react-spring";
import Axios from "axios";

const DirectoriesList = ({ socket }) => {
  const dataRef = useRef();
  const props = useSpring({ opacity: 1, from: { opacity: 0 } });
  const [dirsData, setDirsData] = useState([]);
  const [eventMsg, setEventMsg] = useState({ bg: "", msg: "" });

  useEffect(() => {
    Axios.get("/api/admin/directories").then(({ data }) => {
      setDirsData(data);
    });

    socket.on("scan-finish", ({ id }) => {
      if (id) {
        let dir = dataRef.current.find(d => d.Id === id);
        dir.IsLoading = false;
        setDirsData(dataRef.current);
      } else {
      }
      setDirsData(dataRef.current);
    });

    socket.on("scan-info", info => {
      console.log(info);
    });
    return () => {
      delete socket._callbacks["$scan-finish"];
      delete socket._callbacks["$scan-info"];
    };
  }, [socket]);

  const removeDir = e => {
    let tr = e.target.closest("tr");
    if (tr) {
      Axios.delete("/api/admin/directories/remove", { data: { Id: tr.id } }).then(
        ({ data }) => {
          if (data.removed) {
            setDirsData(dirsData.filter(d => d.Id !== tr.id));
          } else {
            setEventMsg({ bg: "danger", msg: data.msg });
          }
        }
      );
    }
  };

  const rescan = e => {
    let tr = e.target.closest("tr");
    let dir = dataRef.current.find(d => d.Id === tr.id);
    if (!dir.IsLoading) {
      socket.emit("scan-dir", { Id: tr.id });
      dir.IsLoading = true;
      setDirsData(dataRef.current);
    }
  };

  useEffect(() => {
    dataRef.current = [...dirsData];
  });

  return (
    <anin.div id="tab-directories" style={props}>
      <div className={"event-msg " + eventMsg.bg}>{eventMsg.msg}</div>
      <table id="dir-list" className="table table-dark table-hover table-bordered">
        <thead>
          <tr>
            <th>Actions</th>
            <th>Name</th>
            <th>Full Path</th>
          </tr>
        </thead>
        <tbody>
          {dirsData.length === 0 ? (
            <tr className="text-center">
              <td colSpan="3">Not Directory Added</td>
            </tr>
          ) : (
            dirsData.map(dir => (
              <tr id={dir.Id} key={dir.Id}>
                <td>
                  <span className="dir-sync" onClick={rescan}>
                    <i className={"fas fa-sync" + (dir.IsLoading ? " fa-spin" : "")} />
                  </span>
                  <span className="dir-remove ml-2" onClick={removeDir}>
                    <i className="fas fa-trash-alt" />
                  </span>
                </td>
                <td>{dir.Name}</td>
                <td>{dir.FullPath}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </anin.div>
  );
};

export default DirectoriesList;
