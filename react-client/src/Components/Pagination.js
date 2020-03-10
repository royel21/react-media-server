import React from "react";
import "./PageControls.css";

const paginationInput = (li, page, totalPages, goToPage) => {
  let input = li.querySelector("input");
  if (!input) {
    li.textContent = "";

    li.innerHTML = `<input type="text" value=${page} class="form-control" min=1 
                       max=${totalPages}>`;

    let newInput = li.querySelector("input");

    newInput.addEventListener("focusout", e => {
      li.textContent = page + "/" + totalPages;
    });

    newInput.onkeydown = event => {
      if (event.keyCode === 13) {
        page = parseInt(newInput.value);
        newInput = null;
        goToPage(page);
        li.textContent = page + "/" + totalPages;
      }
    };
    newInput.focus();
    newInput.setSelectionRange(newInput.value.length, newInput.value.length);
  }
};

const pagerClick = (e, page, totalPages, goToPage) => {
  let li = e.target;
  console.log(li.id);
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

const Pagination = props => {
  const { goToPage, page, totalPages } = props.data;

  return totalPages > 1 ? (
    <div
      id="pager"
      onClick={e => {
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

export default Pagination;
