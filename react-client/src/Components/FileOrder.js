import React from "react";

const FileOrder = props => {
  let { order } = props.order;

  return (
    <div id="ordering" className="input-group">
      <div className="input-group-prepend">
        <label htmlFor="order-select" className="input-group-text">
          Sort
        </label>
      </div>
      <select
        name="orderby"
        id="order-select"
        className="fa form-control"
        onChange={props.changeOrder(this)}
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
