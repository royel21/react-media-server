import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./Navbar.css";

class Navbar extends Component {
  state = {
    items: [
      {
        id: "home",
        name: "Home",
        url: "/",
        icon: "clipboard-list"
      },
      {
        id: "mangas",
        name: "Mangas",
        url: "/mangas",
        icon: "book"
      },
      {
        id: "videos",
        name: "Videos",
        url: "/videos",
        icon: "film"
      },
      {
        id: "categories",
        name: "Categories",
        url: "/categories",
        icon: "tags"
      },
      {
        id: "favorities",
        name: "Favorities",
        url: "/favorities",
        icon: "heart"
      }
    ]
  };
  render() {
    return (
      <nav id="menu" className="navbar navbar-expand navbar-dark bg-dark">
        <ul className="navbar-nav">
          <li className="nav-item">
            <NavLink to="/" className="nav-link">
              <FontAwesomeIcon icon="clipboard-list" /> Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/mangas" className="nav-link">
              <FontAwesomeIcon icon="book" /> Mangas
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/videos" className="nav-link">
              <FontAwesomeIcon icon="film" /> Videos
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/categories" className="nav-link">
              <FontAwesomeIcon icon="tags" /> Categories
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/favorities" className="nav-link">
              <FontAwesomeIcon icon="tags" /> Favorities
            </NavLink>
          </li>
        </ul>
        <ul className="navbar-nav">
          <li className="nav-item">
            <NavLink to="#" className="nav-link">
              <FontAwesomeIcon icon="user-alt" /> Royel Consoro
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/logout" className="nav-link">
              <FontAwesomeIcon icon="sign-out-alt" />
            </NavLink>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;
