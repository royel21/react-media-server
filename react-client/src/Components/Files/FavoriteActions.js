import React, { useContext } from "react";
import { FavoriteContext } from "../../Context/FavoriteContext";

const FavoriteActions = ({ showAddFav, setShowAddFav }) => {
  const { favorites } = useContext(FavoriteContext);

  const actions = e => {
    e.stopPropagation();
    console.log(e.target);
    if (e.target.tagName !== "LI") return;

    // TODO implement add to favorite
    let el = document
      .getElementById(showAddFav.fileId)
      .querySelector(".fa-star");
    el.className = "fas fa-star text-warning";
    let el2 = e.target.closest(".fa-star");
    console.log(el, el2);
    console.log(e.target.id, showAddFav);
    setShowAddFav({ show: false, fileId: "" });
  };

  return (
    <div id="fav-context" onClick={actions}>
      <ul id="fav-list">
        {favorites.map(f => (
          <li key={f.Id} id={f.Id}>
            {f.Name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoriteActions;
