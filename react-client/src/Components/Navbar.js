import React from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";

import "./Navbar.css";

const Navbar = ({ setUser }) => {
  const logOut = () => {
    axios.post("/api/user/logout").then(resp => {
      if (resp.status === 200) {
        setUser({ username: "", isAutenticated: false });
      }
    });
  };
  return (
    <nav id="menu" className="navbar navbar-expand navbar-dark bg-dark">
      <ul className="navbar-nav">
        <li className="nav-item">
          <NavLink exact to="/" className="nav-link">
            <i className="fas fa-home" />
            <span> Home</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/mangas" className="nav-link">
            <i className="fas fa-book" />
            <span> Mangas</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/videos" className="nav-link">
            <i className="fas fa-film" />
            <span> Videos</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/favorities" className="nav-link">
            <i className="fas fa-heart" />
            <span> Favorities</span>
          </NavLink>
        </li>
      </ul>
      <ul className="navbar-nav">
        <li className="nav-item">
          <NavLink to="#" className="nav-link">
            <i className="fas fa-user-alt" />
            <span> Royel Consoro</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/" className="nav-link" onClick={logOut}>
            <i className="fas fa-sign-out-alt" />
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
