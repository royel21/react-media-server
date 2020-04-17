import React from "react";
import { Link, NavLink, withRouter } from "react-router-dom";
import axios from "axios";

import "./Navbar.css";

const Navbar = ({ User }) => {
  const logOut = e => {
    e.preventDefault();
    axios.post("/api/users/logout").then(resp => {
      if (resp.status === 200) {
        // setUser({ username: "", isAutenticated: false });
        // history.push("/");
        window.location.href = "/login";
      }
    });
  };

  return (
    <nav id="menu" className="navbar navbar-expand navbar-dark bg-dark">
      <ul className="navbar-nav">
        <li className="nav-item">
          <NavLink
            exact
            to="/admin/users"
            isActive={(match, location) => {
              return /(^\/admin$)|(^\/admin\/$)|(^\/admin\/users$)/gi.test(
                location.pathname
              );
            }}
            className="nav-link"
          >
            <i className="fas fa-users" />
            <span> User Manager</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/admin/files" className="nav-link">
            <i className="fas fa-copy" />
            <span> Files Manager</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/admin/folders" className="nav-link">
            <i className="fas fa-folder" />
            <span> Folders Manager</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/admin/disk" className="nav-link">
            <i className="fas fa-sitemap" />
            <span> Disk Manager</span>
          </NavLink>
        </li>
      </ul>
      <ul className="navbar-nav">
        <li id="p-config" className="nav-item">
          <label htmlFor="show-config">
            <i className="fas fa-user-cog" />
            <span>{User.username}</span>
          </label>
        </li>
        <li id="logout" className="nav-item active">
          <Link to="/login" className="nav-link" onClick={logOut}>
            <i className="fas fa-sign-out-alt" />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default withRouter(Navbar);
