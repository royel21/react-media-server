import React from "react";

const FileOrder = props => {
  return (
    <div id="ordering" className="input-group">
      <div className="input-group-prepend">
        <span htmlFor="order-select" className="input-group-text">
          Sort
        </span>
      </div>
      <select
        name="orderby"
        id="order-select"
        className="form-control"
        onChange={props.changeOrder}
        value={props.order}
      >
        <option value="nu">&#xf15d; Name</option>
        <option value="nd">&#xf15e; Name</option>
        <option value="du">&#xf162; Date</option>
        <option value="dd">&#xf163; Date</option>
      </select>
    </div>
  );
};

export default FileOrder;
