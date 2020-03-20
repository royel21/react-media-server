import React, { useState, Fragment, useEffect } from "react";
import Axios from "axios";

import Modal from "./Modal";

import "./UsersManager.css";

const UsersManager = () => {
  document.title = "Users Manager";
  const [usersData, setUsersData] = useState({ users: [], isLoading: true });
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    Axios.get("/api/admin/users").then(({ data }) => {
      if (data.users) {
        setUsersData({ ...data, isLoading: false });
      }
    });
  }, []);

  const saveEdit = e => {
    let tr = e.target.closest("tr");
    let u = {
      Id: "",
      Name: "",
      Role: "",
      State: "",
      Adult: false
    };
    if (tr) {
      u = usersData.users.find(u => u.Id === tr.id);
    }
    setUser(u);
    setShowModal(true);
  };

  const removeUser = e => {
    let tr = e.target.closest("tr");
    let Role = tr.children[1].innerText;
    if (tr) {
      Axios.delete("/api/admin/users/remove", {
        data: { Id: tr.id, Role }
      }).then(({ data }) => {
        if (data.removed) {
          let tusers = usersData.users.filter(u => u.Id !== tr.id);
          setUsersData({ users: tusers, isLoading: false });
        } else {
          setError(data.msg);
        }
      });
    }
  };

  return (
    <Fragment>
      {showModal ? (
        <Modal
          setShowModal={setShowModal}
          user={user}
          usersData={usersData}
          setUsersData={setUsersData}
        />
      ) : (
        ""
      )}
      {usersData.isLoading ? (
        <div className="loading">
          <h3>Loading...</h3>
          <div className="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      ) : (
        <div id="u-manager" className="card bg-dark manager">
          <div className="remove-error">{error}</div>
          <div id="t-control">
            <span className="badge bg-primary" onClick={saveEdit}>
              <i className="fas fa-user-plus"></i>
            </span>
            <h3 className="text-center">Users Manager</h3>
          </div>
          <table className="table table-dark table-hover table-bordered">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>State</th>
                <th>Adult</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersData.users.map(u => (
                <tr id={u.Id} key={u.Name}>
                  <td>{u.Name}</td>
                  <td>{u.Role}</td>
                  <td>{u.State}</td>
                  <td>{u.AdultPass ? "true" : "false"}</td>
                  <td>
                    <span className="u-edit" onClick={saveEdit}>
                      <i className="fas fa-edit"></i>
                    </span>
                    <span className="u-remove ml-2" onClick={removeUser}>
                      <i className="fas fa-trash-alt"></i>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Fragment>
  );
};

export default UsersManager;
