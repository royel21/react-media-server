import React from "react";
import axios from "axios";

import "./Login.css";
import { useState } from "react";

const Login = ({ setUser }) => {
  const [localUser, setLocalUser] = useState({ username: "", password: "" });
  const handleChange = (e) => {
    setLocalUser({ ...localUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("/api/users/login", localUser).then(({ data }) => {
      if (data.isAutenticated) {
        setUser({ ...data, isAutenticating: false });
      }
    });
  };

  return (
    <div id="login-container">
      <form method="post" className="card bg-dark p-3" onSubmit={handleSubmit}>
        <h3 className="mb-4">Login</h3>
        <div className="input-group">
          <div className="input-group-prepend">
            <label htmlFor="" className="input-group-text">
              <i className="fas fa-user"></i>
            </label>
          </div>
          <input
            type="text"
            className="form-control"
            name="username"
            placeholder="Name"
            value={localUser.username}
            onChange={handleChange}
            tabIndex="1"
          />
        </div>
        <div id="name-errors" className="error text-left text-danger"></div>
        <div className="input-group">
          <div className="input-group-prepend">
            <label htmlFor="" className="input-group-text">
              <i className="fas fa-key"></i>
            </label>
          </div>
          <input
            type="password"
            className="form-control"
            name="password"
            placeholder="Password"
            autoComplete="on"
            onChange={handleChange}
            value={localUser.password}
            tabIndex="2"
          />
        </div>

        <div id="pasword-errors" className="error text-left text-danger"></div>
        <div className="form-footer">
          <button className="btn" tabIndex="3">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
