import React, { useState, Fragment } from "react";
import Axios from "axios";

const FavoritiesManager = ({ id, setFavorite, favorities }) => {
  const [favManager, setFavManager] = useState(false);
  const [currentFav, setCurrentFav] = useState({ Id: "", Name: "" });
  const updateCurrentFav = e => {
    let tr = e.target.closest("tr");
    let input = e.target;
    let fav = {
      Id: currentFav.Id
    };

    if (tr) {
      fav.Id = tr.id;
      fav.Name = tr.textContent;
    } else {
      fav.Name = input.value;
    }
    setCurrentFav(fav);
  };

  const saveFav = () => {
    console.log(currentFav);

    if (!currentFav.Name) return;

    Axios.post("/api/files/favorities/add-edit", currentFav).then(({ data }) => {
      if (currentFav.Id) {
      } else {
      }
      setCurrentFav({ Id: "", Name: "" });
    });
  };
  const clearFav = () => {
    setCurrentFav({ Id: "", Name: "" });
  };
  return (
    <Fragment>
      {favManager ? (
        <div id="fav-manager" className="card text-light">
          <div className="modal-title">
            <div id="fav-controls">
              <div className="input-group-prepend">
                <label id="addfav" className="input-group-text" onClick={saveFav}>
                  <i className="fas fa-save"></i>
                </label>
                <input
                  type="text"
                  name=""
                  id="fav-box"
                  className="form-control"
                  defaultValue={currentFav.Name}
                  onInput={updateCurrentFav}
                  placeholder="New Favorite"
                />
                <span onClick={clearFav}>
                  <i className="fas fa-times"></i>
                </span>
              </div>
            </div>
          </div>
          <div className="modal-body">
            <div className="modal-content">
              <table className="table table-bordered bg-light table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {favorities.map(f => (
                    <tr key={f.Id} id={f.Id}>
                      <td>{f.Name}</td>
                      <td>
                        <span onClick={updateCurrentFav}>
                          <i className="fas fa-edit"></i>
                        </span>
                        <span>
                          <i className="fas fa-trash-alt"></i>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      <div id="all-favs" className="input-group">
        <div className="input-group-prepend">
          <label
            htmlFor="show-fav"
            className="input-group-text"
            onClick={() => {
              setFavManager(!favManager);
            }}
          >
            <i className="fas fa-star "></i>
          </label>
        </div>
        <select id="favs" className="form-control" defaultValue={id} onChange={setFavorite}>
          {favorities.map(({ Id, Name }) => {
            return (
              <option key={Id} value={Name}>
                {Name}
              </option>
            );
          })}
        </select>
      </div>
    </Fragment>
  );
};

export default FavoritiesManager;
