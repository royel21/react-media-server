export const genUrl = (page, { order, fPerPage }, filter, type, notApi, id) => {
  let itemsperpage =
    fPerPage === 0 ? Math.floor(window.innerWidth / 200) * 3 : fPerPage;
  if (["favorities", "folder-content"].includes(type) || id) {
    type =
      type === "favorities"
        ? `favorities/${id || "0"}`
        : `folder-content/${id}`;
  }

  if (notApi) {
    return `/${type}/${page || 1}/${filter || ""}`;
  } else {
    return `/api/files/${type}/${order || "nu"}/${page ||
      1}/${itemsperpage}/${filter || ""}`;
  }
};

export const PageTitles = {
  mangas: "Mangas",
  videos: "Videos",
  folders: "Folders",
  favorities: "Favorities",
  "folder-content": "Folder-content"
};
