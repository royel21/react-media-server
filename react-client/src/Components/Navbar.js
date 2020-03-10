import React from "react";
import { NavLink } from "react-router-dom";

import "./Navbar.css";

const Navbar = () => {
  return (
    <nav id="menu" className="navbar navbar-expand navbar-dark bg-dark">
      <ul className="navbar-nav">
        <li className="nav-item">
          <NavLink exact to="/" className="nav-link">
            <i className="fas fa-clipboard-list" />
            <span> Home</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/mangas/nu" className="nav-link">
            <i className="fas fa-book" />
            <span> Mangas</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/videos/nu" className="nav-link">
            <i className="fas fa-film" />
            <span> Videos</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/favorities/nu" className="nav-link">
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
          <NavLink to="/logout" className="nav-link">
            <i className="fas fa-sign-out-alt" />
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
