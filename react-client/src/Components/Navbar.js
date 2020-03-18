import React, { useContext, useState } from "react";
import { Link, NavLink, withRouter } from "react-router-dom";
import axios from "axios";

import { PageConfigContext } from "../Context/PageConfigContext";

import "./Navbar.css";

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

  const { pageConfig, setPageConfig } = useContext(PageConfigContext);
  const [localConfig, setLocalConfig] = useState(pageConfig);

  const filePerPage = e => {
    let val = e.target.value;
    val = val >= 0 ? val : 0;
    val = val <= 501 ? val : 500;

    setLocalConfig({ order: localConfig.order, fPerPage: parseInt(val) });
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
          <NavLink to="/favorities" className="nav-link">
            <i className="fas fa-heart" />
            <span> Favorities</span>
          </NavLink>
        </li>
      </ul>
      <ul className="navbar-nav">
        <li id="p-config" className="nav-item">
          <label htmlFor="show-config">
            <i className="fas fa-user-cog" />
            <span>{User.username}</span>
          </label>
          <input type="checkbox" name="" id="show-config" />
          <div id="user-config">
            <h4>Page Config</h4>
            <div id="config-content">
              <div className="page-control">
                <label>Sort By: </label>
                <select
                  name="orderby"
                  id="order-select"
                  onChange={e =>
                    setLocalConfig({
                      order: e.target.value,
                      fPerPage: pageConfig.fPerPage
                    })
                  }
                >
                  <option value="nu">&#xf15d; Name</option>
                  <option value="nd">&#xf15e; Name</option>
                  <option value="du">&#xf162; Date</option>
                  <option value="dd">&#xf163; Date</option>
                </select>
              </div>
              <div className="page-control">
                <label>File per Page: </label>
                <input
                  type="number"
                  name="fperpage"
                  id="fperpage"
                  min="0"
                  max="500"
                  value={localConfig.fPerPage || 0}
                  onChange={filePerPage}
                />
                <span id="fpp-tips">0 = auto, max 500</span>
              </div>
              <div className="bottom-controls">
                <span
                  id="btn-save"
                  className="btn"
                  onClick={() => {
                    setPageConfig(localConfig);
                  }}
                >
                  Save
                </span>
              </div>
            </div>
          </div>
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
