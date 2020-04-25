const paginationInput = (li, page, totalPages, goToPage) => {
  let input = li.querySelector("input");
  if (!input) {
    li.textContent = "";

    li.innerHTML = `<input type="text" value=${page} class="form-control" min=1 
                         max=${totalPages}>`;

    let newInput = li.querySelector("input");

    newInput.addEventListener("focusout", (e) => {
      li.textContent = `${page} / ${totalPages}`;
    });

    newInput.onkeydown = (event) => {
      if (event.keyCode === 13) {
        let pg = parseInt(newInput.value) - 1;
        if (!isNaN(pg)) {
          page = pg < 1 ? 1 : pg > totalPages ? totalPages : pg;
          goToPage(page);
        }
        li.textContent = `${page} / ${totalPages}`;
        newInput = null;
      }
    };
    newInput.focus();
    newInput.setSelectionRange(newInput.value.length, newInput.value.length);
  }
};

export default paginationInput;
