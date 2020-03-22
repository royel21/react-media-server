import React from "react";

const TreeItem = props => {
  const { data, scanFolder, type } = props;
  return data.map(d => (
    <li id={d.Id} key={d.Id} className="tree-item">
      <span className="dir">
        <i className={`fa fa-${type} mr-1`}></i>
        {d.Name}
      </span>
      <span className="caret" onClick={scanFolder}>
        ▶
      </span>
      {d.Content.length > 0 ? (
        <ul className="tree-node">
          <TreeItem data={d.Content} scanFolder={scanFolder} type="folder" />
        </ul>
      ) : (
        ""
      )}
    </li>
  ));
};

export default TreeItem;
