import React, { useState, Fragment, useContext } from "react";
import Axios from "axios";
import { FavoriteContext } from "../../Context/FavoriteContext";

const FavoritiesManager = ({ id, loadFavorite }) => {
  const { favorities, setFavorities } = useContext(FavoriteContext);
  const [favManager, setFavManager] = useState(false);
  const [currentFav, setCurrentFav] = useState({ Id: "", Name: "" });
  const [serverError, setServerError] = useState("");

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
    if (!currentFav.Name) return;
    Axios.post("/api/files/favorities/add-edit", currentFav).then(
      ({ data }) => {
        if (data.Id) {
          let favs = favorities.filter(f => f.Id !== currentFav.Id);
          favs.push(data);
          setFavorities(favs.sort((a, b) => a.Name.localeCompare(b.Name)));
          setCurrentFav({ Id: "", Name: "" });
        } else {
          console.log(data);
        }
      }
    );
  };

  const clearFav = e => {
    setCurrentFav({ Id: "", Name: "" });
  };

  const remove = e => {
    let tr = e.target.closest("tr");
    Axios.delete("/api/files/favorities/remove", { data: { Id: tr.id } }).then(
      ({ data }) => {
        if (data.removed) {
          let favs = favorities.filter(f => f.Id !== tr.id);
          setFavorities(favs);
          setServerError("");
        } else {
          setServerError(data.msg);
        }
      }
    );
  };

  return (
    <Fragment>
      {favManager ? (
        <div id="fav-manager" className="card text-light">
          <div className="modal-title">
            <div id="fav-controls">
              <div className="input-group-prepend">
                <label
                  id="addfav"
                  className="input-group-text"
                  onClick={saveFav}
                >
                  <i className="fas fa-save"></i>
                </label>
                <input
                  type="text"
                  name=""
                  id="fav-box"
                  className="form-control"
                  value={currentFav.Name}
                  onChange={updateCurrentFav}
                  onKeyDown={e => {
                    if (e.keyCode === 13) saveFav();
                    e.target.focus();
                  }}
                  placeholder="New Favorite"
                  autoFocus
                />
                <span onClick={clearFav}>
                  <i className="fas fa-times"></i>
                </span>
              </div>
            </div>
            {serverError ? (
              <div className="text-danger">{serverError}</div>
            ) : (
              ""
            )}
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
                        <span onClick={remove}>
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
            className="input-group-text fa-stack"
            onClick={() => {
              setFavManager(!favManager);
            }}
          >
            <i className="fas fa-cog fa-stack-1x text-success"></i>
            <i className="fas fa-star fa-stack-1x"></i>
          </label>
        </div>
        <select
          id="favs"
          className="form-control"
          defaultValue={id}
          onChange={e => {
            loadFavorite(e.target.value);
          }}
        >
          {favorities.map(({ Id, Name }) => {
            return (
              <option key={Id} value={Id}>
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
