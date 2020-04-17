import React, { useContext } from "react";
import { Link, NavLink, withRouter } from "react-router-dom";
import { UserContext } from "../Context/UserContext";

const Navbar = () => {
  const { User, logOut } = useContext(UserContext);

  return (
    <nav id="menu" className="navbar navbar-expand navbar-dark bg-dark">
      <ul className="navbar-nav">
        <li className="nav-item">
          <NavLink
            exact
            to="/users"
            isActive={(match, location) => {
              return /(^\/$)|(^\/users$)/gi.test(location.pathname);
            }}
            className="nav-link"
          >
            <i className="fas fa-users" />
            <span> User Manager</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/files" className="nav-link">
            <i className="fas fa-copy" />
            <span> Files Manager</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/folders" className="nav-link">
            <i className="fas fa-folder" />
            <span> Folders Manager</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/disk" className="nav-link">
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
