import React, { useContext, Fragment } from "react";

import { PageConfigContext } from "../../Context/PageConfigContext";

import Files from "./Files";
import FileFilter from "./FileFilter";
import Pagination from "./Pagination";
import FileListHooks from "./FileListHooks";
import FavoritiesManager from "./FavoriteManager";

import { fileNavKeydown, fileNavClick } from "../KeyboardNav";
import { useParams } from "react-router-dom";
import { genUrl } from "./utils";

const FilesList = props => {
  let { id } = useParams();
  const { pageConfig } = useContext(PageConfigContext);
  const { page, filter, itemsperpage, pagedata, goToPage, fileFilter, processFile } = FileListHooks(
    props,
    pageConfig
  );

  return (
    <React.Fragment>
      <div
        id="files-list"
        onClick={fileNavClick}
        onKeyDown={e => {
          fileNavKeydown(e, page, itemsperpage, goToPage);
        }}
      >
        <Files files={pagedata.files} processFile={processFile} />
      </div>
      <div className="controls">
        {props.type.includes("favorities") ? (
          <Fragment>
            <FavoritiesManager favorities={pagedata.favorities} />
            <div id="all-favs" className="input-group">
              <div className="input-group-prepend">
                <label htmlFor="show-fav" className="input-group-text">
                  <i className="fas fa-star "></i>
                </label>
              </div>
              <select
                id="favs"
                className="form-control"
                defaultValue={id}
                onChange={e => {
                  props.history.push(
                    genUrl(page, pageConfig, filter, "favorities", true, e.target.value)
                  );
                }}
              >
                {pagedata.favorities.map(({ Id, Name }) => {
                  return (
                    <option key={Id} value={Name}>
                      {Name}
                    </option>
                  );
                })}
              </select>
            </div>
          </Fragment>
        ) : (
          ""
        )}
        <FileFilter
          {...props}
          fileFilter={fileFilter}
          filter={filter}
          showback={props.type.includes("folder-content")}
        />
        <Pagination
          data={{
            goToPage,
            page,
            totalFiles: pagedata.totalFiles,
            totalPages: pagedata.totalPages
          }}
        />
        <span className="badge badge-primary total-files">{pagedata.totalFiles}</span>
      </div>
    </React.Fragment>
  );
};

export default FilesList;
