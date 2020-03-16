import React from "react";

const FavoritiesManager = ({ favorities }) => {
  return (
    <div id="fav-manager" className="card bg-dark text-light">
      <div className="modal-title">Favorites</div>
      <div className="modal-body">
        <div id="fav-controls">
          <div className="input-group-prepend">
            <label htmlFor="show-fav" className="input-group-text btn">
              <i className="fas fa-plus "></i>
            </label>
            <input type="text" name="" id="fav-box" className="form-control" />
          </div>
        </div>
        <ul id="fav-list">
          {favorities.map(f => (
            <li key={f.Id} id={f.Id}>
              {f.Name}
              <span className="fas fa-trash-alt"></span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FavoritiesManager;
