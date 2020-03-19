import React from "react";
import { Link, NavLink, withRouter } from "react-router-dom";
import axios from "axios";

import "./Navbar.css";
import UserConfig from "./UserConfig";

const Navbar = ({ User, setUser, history }) => {
  const logOut = e => {
    e.preventDefault();
    axios.post("/api/users/logout").then(resp => {
      if (resp.status === 200) {
        setUser({ username: "", isAutenticated: false });
        history.push("/");
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
          <NavLink to="/folders" className="nav-link">
            <i className="fas fa-folder" />
            <span> Folders</span>
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
          <NavLink to="/favorites" className="nav-link">
            <i className="fas fa-heart" />
            <span> Favorites</span>
          </NavLink>
        </li>
      </ul>
      <ul className="navbar-nav">
        <li id="p-config" className="nav-item">
          {User.role === "Administrator" ? (
            <NavLink to="/favorites" className="nav-link">
              <i className="fas fa-user-cog" />
              <span>{User.Name}</span>
            </NavLink>
          ) : (
            <UserConfig User={User} />
          )}
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
