import React from "react";
import Pagination from "../Pagination";
import Fileter from "../FileFilter";

const Files = ({
  title,
  data,
  goToPage,
  page,
  folderId,
  handleClick,
  filter,
  fileFilter,
}) => {
  let { files, totalPages, items } = data;
  let fileItems = files.length;
  return (
    <div className="file-list col-6">
      <div className="controls">
        <Fileter filter={filter} fileFilter={fileFilter} />
        <h4 className="text-center">{`${items} - ${title}`}</h4>
      </div>
      <div className="list-container">
        <ul className="list-group text-dark">
          {fileItems === 0 ? (
            <li className="list-group-item">
              {title.includes("Folder") ? "Not Folders Found" : "Not Files Found"}
            </li>
          ) : (
            files.map((f) => (
              <li
                id={f.Id}
                key={f.Id}
                className={
                  "list-group-item list-group-item-action" +
                  (folderId === f.Id ? " active" : "")
                }
                onClick={handleClick}
                title={f.Name}
              >
                <i className="fas fa-edit"></i>
                <i className="fas fa-trash-alt"></i>
                <span>{f.Name}</span>
              </li>
            ))
          )}
        </ul>
      </div>
      <div className="list-controls">
        <Pagination page={page} totalPages={totalPages} goToPage={goToPage} />
      </div>
    </div>
  );
};

export default Files;
