import React, { useContext } from "react";
import { FavoriteContext } from "../../Context/FavoriteContext";

const FavoriteActions = ({ showAddFav, setShowAddFav }) => {
  const { favorities } = useContext(FavoriteContext);

  const actions = e => {
    console.log(e.target.id, showAddFav);
    setShowAddFav({ show: false, fileId: "" });

    //   document.querySelector()
    //   .classList.toggle("text-warning fas far");
    console.log("#" + showAddFav.fileId + " .fa-star");
  };

  return (
    <ul id="fav-list">
      {favorities.map(f => (
        <li key={f.Id} id={f.Id} onClick={actions}>
          {f.Name}
        </li>
      ))}
    </ul>
  );
};

export default FavoriteActions;
