import React, { useState, useEffect } from "react";
import { animated as anin, useSpring } from "react-spring";
import Axios from "axios";

const DirectoriesList = ({ socket }) => {
  const props = useSpring({ opacity: 1, from: { opacity: 0 } });
  const [dirsData, setDirsData] = useState([]);

  useEffect(() => {
    Axios.get("/api/admin/directories").then(({ data }) => {
      setDirsData(data);
    });

    socket.on("scan-fihish", Id => {
      let dir = dirsData.find(d => d.Id === Id);
      dir.isLoading = false;
    });
  }, []);

  return (
    <anin.div id="tab-directories" style={props}>
      <h3>Directories</h3>
      <table className="table table-dark table-hover table-bordered">
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
              <td colSpan="2">Not Directory Added</td>
            </tr>
          ) : (
            dirsData.map(dir => (
              <tr id={dir.Id} key={dir.Id}>
                <td>
                  <span className="dir-sync">
                    <i
                      className={
                        "fas fa-sync" + (dir.IsLoading ? " fa-spin" : "")
                      }
                    ></i>
                  </span>
                  <span className="dir-remove ml-2">
                    <i className="fas fa-trash-alt"></i>
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
