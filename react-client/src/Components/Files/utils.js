export function formatTime(time) {
  var h = Math.floor(time / 3600);
  var min = Math.floor((time / 3600 - h) * 60);
  var sec = Math.floor(time % 60);
  return (
    (h === 0 ? "" : h + ":") + String(min).padStart(2, "0") + ":" + String(sec).padStart(2, "0")
  );
}

export const genUrl = (page, { order, fPerPage }, filter, type, notApi, id) => {
  let itemsperpage = fPerPage === 0 ? Math.floor(window.innerWidth / 200) * 3 : fPerPage;
  if (["favorities", "folder-content"].includes(type) || id) {
    type = type === "favorities" ? `favorities/${id || "0"}` : `folder-content/${id}`;
  }

  if (notApi) {
    return `/${type}/${page || 1}/${filter || ""}`;
  } else {
    return `/api/files/${type}/${order || "nu"}/${page || 1}/${itemsperpage}/${filter || ""}`;
  }
};

export const PageTitles = {
  mangas: "Mangas",
  videos: "Videos",
  folders: "Folders",
  favorities: "Favorities",
  "folder-content": "Folder-content"
};

export const FileTypes = {
  Manga: {
    type: "mangas",
    class: "book-open",
    formatter(a, b) {
      return `${a}/${b}`;
    }
  },
  Video: {
    type: "videos",
    class: "play-circle",
    formatter(a, b) {
      return `${formatTime(a)}/${formatTime(b)}`;
    }
  },
  undefined: {
    type: "folders",
    class: "folder-open",
    formatter() {
      return "";
    }
  }
};
