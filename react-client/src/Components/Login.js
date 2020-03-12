import React, { Fragment, useState, useEffect } from "react";
import "./Login.css";

const Login = () => {
  const [user, setUser] = useState({
    name: "",
    password: ""
  });

  const [error, setError] = useState({ type: "", message: "" });

  const handleSubmit = e => {
    e.preventDefault();
    let name = e.target.querySelector("#name").value;
    let password = e.target.querySelector("#password").value;
    let err = { type: "", name: "" };

    if (name && password) {
      setUser({ name, password });
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
  useEffect(() => {}, [error, user]);
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
            <input
              id="name"
              type="text"
              className="form-control"
              name="Name"
              placeholder="Name"
              tabIndex="1"
            />
          </div>
          <div id="name-errors" className="error text-left text-danger">
            {error.type.includes("user") ? error.message : ""}
          </div>
          <div className="input-group">
            <input
              id="password"
              type="password"
              className="form-control"
              name="Password"
              placeholder="Password"
              tabIndex="2"
            />
          </div>

          <div id="pasword-errors" className="error text-left text-danger">
            {error.type.includes("pass") ? error.message : ""}
          </div>
          <div className="form-footer">
            <button className="btn" tabIndex="3">
              Login
            </button>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default Login;
