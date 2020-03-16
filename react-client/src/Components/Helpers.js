const genUrl = (page, { order, fPerPage }, filter, type, notApi, id) => {
  let itemsperpage =
    fPerPage === 0 ? Math.floor(window.innerWidth / 200) * 3 : fPerPage;

  let tType = id
    ? `${type === "favorite" ? "favorites" : "folder-content"}/${id}`
    : type;

  let api = `/api/files/${tType}/${order || "nu"}/${page ||
    1}/${itemsperpage}/${filter || ""}`;

  let local = `/${tType}/${page || 1}/${filter || ""}`;

  console.log(type, local, api);

  return notApi ? local : api;
};

export const pushHistory = (pg, fltr, tid) => {
  history.push(genUrl(pg, pageConfig, fltr, type, true, tid || id));
};

export const goToPage = pg => {
  if (pg !== page && pg > 0 && pg < pagedata.totalPages + 1) {
    pushHistory(pg, filter);
  }
  return pg;
};

export const fileFilter = () => {
  let input = document.getElementById("filter-file");

  let fltr = input && input.value;
  pushHistory(1, fltr);
};
