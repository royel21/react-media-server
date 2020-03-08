import React from "react";
import "./PageControls.css";

const pagerClick = (e, page, totalPages, goToPage) => {
  let span = e.target;

  if (["prev-page", "next-page"].includes(span.id)) {
    page += span.id === "prev-page" ? -1 : 1;
    goToPage(page);
  } else if (e.target.id.includes("current-page")) {
    let input = span.querySelector("input");
    if (!input) {
      span.textContent = "";

      span.innerHTML = `<input type="text" value=${page} class="form-control"
                       style="width:50px; height: 24px; padding: 0 0 0 4px; font-size:15px; color: black;" min=1 
                       max=${totalPages}>`;

      let newInput = span.querySelector("input");

      newInput.addEventListener("focusout", e => {
        span.textContent = page + "/" + totalPages;
      });

      newInput.onkeydown = event => {
        if (event.keyCode === 13) {
          page = parseInt(newInput.value);

          if (page > totalPages) {
            page = totalPages;
          }
          newInput = null;
          goToPage(page);
          span.textContent = page + "/" + totalPages;
        }
      };
      newInput.focus();
    }
  }
};

const Pagination = props => {
  const { goToPage, page, totalPages } = props.data;

  return totalPages > 1 ? (
    <div
      id="pager"
      className="input-group-text"
      onClick={e => {
        pagerClick(e, page, totalPages, goToPage);
      }}
    >
      <span id="prev-page">
        <i className="fas fa-chevron-circle-left"></i>
      </span>
      <span id="current-page">{page + "/" + totalPages}</span>
      <span id="next-page">
        <i className="fas fa-chevron-circle-right"></i>
      </span>
    </div>
  ) : (
    <span></span>
  );
};

export default Pagination;
