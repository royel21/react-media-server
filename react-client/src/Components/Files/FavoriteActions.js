import React, { useContext } from "react";
import { FavoriteContext } from "../../Context/FavoriteContext";
import Axios from "axios";

const FavoriteActions = ({ showAddFav, setShowAddFav, Type }) => {
  const { favorites } = useContext(FavoriteContext);

  const actions = e => {
    e.stopPropagation();
    if (e.target.tagName !== "LI") return;
    // TODO implement add to favorite
    Axios.post("/api/files/favorites/add-file", {
      FileId: showAddFav.fileId,
      FavoriteId: e.target.id
    }).then(({ data }) => {
      if (data) {
        let el = document
          .getElementById(showAddFav.fileId)
          .querySelector(".fa-star");
        el.className = "fas fa-star text-warning";
        setShowAddFav({ show: false, fileId: "" });
      }
    });
  };

  return (
    <div id="fav-context" onClick={actions}>
      <ul id="fav-list">
        {favorites
          .filter(f => f.Type === Type)
          .map(f => (
            <li key={f.Id} id={f.Id}>
              {f.Name}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default FavoriteActions;
