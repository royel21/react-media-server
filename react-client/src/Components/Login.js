import React, { Fragment, useState } from "react";
import axios from "axios";

import "./Login.css";

const Login = ({ setUser }) => {
  const [error, setError] = useState({ type: "", message: "" });

  const handleSubmit = e => {
    e.preventDefault();
    let name = e.target.querySelector("#name").value;
    let password = e.target.querySelector("#password").value;
    let err = { type: "", name: "" };

    if (name && password) {
      setError(err);
      axios
        .post("/api/users/login", { username: name, password })
        .then(resp => {
          if (resp.data.isAutenticated) {
            setUser(resp.data);
          } else {
            setError(resp.data);
          }
        });
    } else {
      if (!name) {
        err.type = "user";
        err.message = "User can't be empty";
      } else {
        err.type = "pass";
        err.message = "Password can't be empty";
      }
      setError(err);
    }
  };

  document.title = "Login";
  return (
    <Fragment>
      <div id="login-container">
        <form
          method="post"
          className="card bg-dark p-3"
          onSubmit={handleSubmit}
        >
          <h3 className="mb-4">Login</h3>
          <div className="input-group">
            <div className="input-group-prepend">
              <label htmlFor="" className="input-group-text">
                <i className="fas fa-user"></i>
              </label>
            </div>
            <input
              id="name"
              type="text"
              className="form-control"
              name="username"
              placeholder="Name"
              tabIndex="1"
            />
          </div>
          <div id="name-errors" className="error text-left text-danger">
            {error.type.includes("user") ? error.message : ""}
          </div>
          <div className="input-group">
            <div className="input-group-prepend">
              <label htmlFor="" className="input-group-text">
                <i className="fas fa-key"></i>
              </label>
            </div>
            <input
              id="password"
              type="password"
              className="form-control"
              name="password"
              placeholder="Password"
              autoComplete="on"
              tabIndex="2"
            />
          </div>

          <div id="pasword-errors" className="error text-left text-danger">
            {error.type.includes("pass") ? error.message : ""}
          </div>
          <div className="form-footer">
            <button className="btn" tabIndex="3">
              Submit
            </button>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default Login;
