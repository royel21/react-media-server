import React, { useState } from "react";
import Axios from "axios";

const Modal = ({ usersData, setUsersData, user, setShowModal }) => {
  const [localUser, setLocaluser] = useState(user);
  const [error, setError] = useState("");

  const updateLocalUser = e => {
    let el = e.target;
    setLocaluser({
      ...localUser,
      [el.name]: el.name.includes("Adult") ? el.checked : el.value
    });
  };

  const submit = e => {
    let tempUser = {};
    document.querySelectorAll(".modal input, .modal select").forEach(el => {
      tempUser[el.name] = el.name.includes("Adult") ? el.checked : el.value;
    });

    if (!tempUser.Name) return setError("Name Can't be empty");
    Axios.post("/api/admin/users/add-edit", tempUser).then(({ data }) => {
      if (!data.fail) {
        let users = [...usersData.users.filter(tuser => tuser.Id !== user.Id), data.user];

        users.sort((a, b) => {
          return a.Name.localeCompare(b.Name);
        });

        setUsersData({
          users,
          loading: false
        });

        setError("");
        setShowModal(false);
      } else {
        setError(data.msg);
      }
    });
  };

  const closeModal = () => {
    setShowModal(false);
  };
  return (
    <div className="modal-container">
      <div className="modal card">
        <div className="modal-header">
          <h3>{localUser.Id ? "Edit" : "Create"}</h3>
        </div>
        <div className="modal-body">
          <input type="hidden" name="Id" value={localUser.Id} />
          <div className="input-group">
            <div className="input-group-prepend">
              <label htmlFor="Name" className="input-group-text">
                <i className="fas fa-user"></i>
              </label>
            </div>
            <input
              className="form-control"
              type="text"
              name="Name"
              value={localUser.Name}
              onChange={updateLocalUser}
            />
          </div>
          <div className="input-group">
            <div className="input-group-prepend">
              <label htmlFor="Password" className="input-group-text">
                <i className="fas fa-key"></i>
              </label>
            </div>
            <input
              className="form-control"
              type="password"
              name="Password"
              autoComplete="new-password"
              onChange={updateLocalUser}
            />
          </div>
          <div className="input-group">
            <div className="input-group-prepend">
              <label htmlFor="Role" className="input-group-text">
                Role
              </label>
            </div>
            <select
              className="form-control"
              name="Role"
              value={localUser.Role}
              onChange={updateLocalUser}
            >
              <option value="User">User</option>
              <option value="Administrator">Administrator</option>
              <option value="Manager">Manager</option>
            </select>
          </div>
          <div className="input-grouping">
            <div className="first-ctrl input-group">
              <div className="input-group-prepend">
                <label htmlFor="State" className="input-group-text">
                  Status
                </label>
              </div>
              <select
                className="form-control"
                name="State"
                value={localUser.Status}
                onChange={updateLocalUser}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="second-ctrl input-group">
              <div className="input-group-prepend">
                <label className="input-group-text">Adult</label>
              </div>
              <input
                id="Adult"
                type="checkbox"
                name="AdultPass"
                checked={localUser.AdultPass}
                onChange={updateLocalUser}
              />
              <label htmlFor="Adult" className="form-control checkadult">
                <i className="fas fa-times"></i>
              </label>
            </div>
          </div>
          {error ? <div className="errors">{error}</div> : ""}
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={closeModal}>
            Cancel
          </button>
          <button className="btn" onClick={submit}>
            {localUser.Id ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
