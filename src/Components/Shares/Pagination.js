import React from "react";
import "./PageControls.css";
import paginationInput from "./PageInput";

const pagerClick = (e, page, totalPages, goToPage) => {
  window.local.setItem("selected", 0);
  let li = e.target;
  switch (e.target.id) {
    case "prev-page": {
      goToPage(page - 1);
      break;
    }
    case "next-page": {
      goToPage(page + 1);
      break;
    }
    case "first-page": {
      goToPage(1);
      break;
    }
    case "last-page": {
      goToPage(totalPages);
      break;
    }
    case "current-page": {
      paginationInput(li, page, totalPages, goToPage);
      break;
    }
    default: {
    }
  }
};

const Pagination = (props) => {
  const { goToPage, page = 1, totalPages } = props.data;

  return totalPages > 1 ? (
    <div
      id="pager"
      onClick={(e) => {
        pagerClick(e, parseInt(page), totalPages, goToPage);
      }}
    >
      <ul className="pagination">
        {window.innerWidth > 700 && page > 1 ? (
          <li id="first-page" className="page-link">
            <i className="fas fa-angle-double-left"></i>
          </li>
        ) : (
          ""
        )}
        <li id="prev-page" className="page-link">
          <i className="fas fa-angle-left"></i>
        </li>
        <li id="current-page" className="page-link">
          {page + "/" + totalPages}
        </li>
        <li id="next-page" className="page-link">
          <i className="fas fa-angle-right"></i>
        </li>
        {window.innerWidth > 700 && page < totalPages ? (
          <li id="last-page" className="page-link">
            <i className="fas fa-angle-double-right"></i>
          </li>
        ) : (
          ""
        )}
      </ul>
    </div>
  ) : (
    <span></span>
  );
};

export default React.memo(Pagination);
