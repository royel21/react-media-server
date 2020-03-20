import React, { useState, Fragment, useEffect } from "react";
import Axios from "axios";

const UsersManager = () => {
  document.title = "Users Manager";
  const [data, setdata] = useState({ users: [], isLoading: true });

  useEffect(() => {
    Axios.get("/api/admin/users").then(({ data }) => {
      if (data.users) {
        setdata({ ...data, isLoading: false });
        console.log(data);
      }
      console.log("loaded");
    });
  }, []);

  return (
    <Fragment>
      {data.isLoading ? (
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
          <div id="t-control">
            <span className="badge bg-primary">
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
              {data.users.map(u => (
                <tr id={u.Id} key={u.Id}>
                  <td>{u.Name}</td>
                  <td>{u.Role}</td>
                  <td>{u.State}</td>
                  <td>{u.AdultPass ? "true" : "false"}</td>
                  <td>
                    <span className="u-edit">
                      <i className="fas fa-edit"></i>
                    </span>
                    <span className="u-remove ml-2">
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
