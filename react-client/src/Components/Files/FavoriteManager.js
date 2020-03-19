import React, { useState, Fragment, useContext } from "react";
import Axios from "axios";
import { FavoriteContext } from "../../Context/FavoriteContext";

const FavoritesManager = ({ id, loadFavorite }) => {
  const { favorites, setFavorites } = useContext(FavoriteContext);

  const [favManager, setFavManager] = useState(false);
  const [currentFav, setCurrentFav] = useState({
    Id: "",
    Name: "",
    Type: "Manga"
  });
  const [serverError, setServerError] = useState("");
  if (favorites.length === 0) return "";

  const updateCurrentFav = e => {
    let tr = e.target.closest("tr");
    let input = e.target;
    let fav = {};

    if (tr) {
      fav = {
        ...favorites.find(f => f.Id === tr.id)
      };
      fav.Name = tr.querySelector("td:first-child").textContent;
    } else {
      fav = { ...currentFav };
      fav.Name = input.value;
    }
    setCurrentFav(fav);
  };

  const saveFav = () => {
    if (!currentFav.Name) return;
    Axios.post("/api/files/favorites/add-edit", currentFav).then(({ data }) => {
      if (data.Id) {
        let favs = favorites.filter(f => f.Id !== currentFav.Id);
        favs.push(data);
        setFavorites(favs.sort((a, b) => a.Name.localeCompare(b.Name)));
        setCurrentFav({ Id: "", Name: "", Type: "Manga" });
      } else {
        setServerError(data.msg);
      }
    });
  };

  const clearFav = e => {
    setCurrentFav({ Id: "", Name: "", Type: "Manga" });
    setServerError("");
  };

  const remove = e => {
    let tr = e.target.closest("tr");
    let Type = tr.querySelector("td:nth-child(2)").textContent;
    Axios.delete("/api/files/favorites/remove", {
      data: { Id: tr.id, Type }
    }).then(({ data }) => {
      if (data.removed) {
        setFavorites(favorites.filter(f => f.Id !== tr.id));
        setServerError("");
      } else {
        setServerError(data.msg);
      }
    });
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
                <select
                  className="form-control"
                  onChange={e => {
                    let curFav = { ...currentFav };
                    curFav.Type = e.target.value;
                    setCurrentFav(curFav);
                  }}
                  value={currentFav.Type}
                >
                  <option>Manga</option>
                  <option>Video</option>
                </select>
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
                    <th>Type</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {favorites.map(f => (
                    <tr key={f.Id} id={f.Id}>
                      <td>{f.Name}</td>
                      <td>{f.Type}</td>
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
          value={id}
          onChange={e => {
            loadFavorite(e.target.value);
          }}
        >
          {favorites.map(({ Id, Name }) => {
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

export default FavoritesManager;
