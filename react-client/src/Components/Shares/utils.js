export function formatTime(time) {
  if (time === 0) return "00:00";

  var h = Math.floor(time / 3600);
  var min = Math.floor((time / 3600 - h) * 60);
  var sec = Math.floor(time % 60);
  return (
    (h === 0 ? "" : h + ":") +
    String(min).padStart(2, "0") +
    ":" +
    String(sec).padStart(2, "0")
  );
}
const isMobile = /(android)|(iphone)/i.test(navigator.userAgent);
const scrollW = isMobile ? 15 : 0;
const itemW = isMobile ? 170 : 200;

export const getFilesPerPage = () => {
  let fwidth = document.getElementById("files-list").offsetWidth;
  let items = parseInt((fwidth - scrollW) / itemW);
  return items * 3;
};

export const genUrl = (page, { order, items }, filter, type, notApi, id) => {
  let itemsperpage = (items || 0) === 0 ? getFilesPerPage() : items;
  if (["favorites", "folder-content"].includes(type) || id) {
    type = type === "favorites" ? `favorites/${id || "0"}` : `folder-content/${id}`;
  }

  filter = (filter || "").replace("%", " ");

  if (notApi) {
    return `/${type}/${page || 1}/${filter}`;
  } else {
    return `/api/files/${type}/${order || "nu"}/${page || 1}/${itemsperpage}/${filter}`;
  }
};

export const PageTitles = {
  mangas: "Mangas",
  videos: "Videos",
  folders: "Folders",
  favorites: "Favorites",
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
  Folder: {
    type: "folders",
    class: "folder-open",
    formatter() {
      return "";
    }
  }
};

var lastEl = null;

export const setfullscreen = element => {
  try {
    if (lastEl && element.tagName !== "BODY") {
      if (document.fullscreenElement.tagName === "BODY") {
        document.exitFullscreen().then(() => {
          element.requestFullscreen();
        });
      } else {
        document.exitFullscreen().then(() => {
          lastEl.requestFullscreen();
        });
      }
    } else {
      if (!document.fullscreenElement) {
        element.requestFullscreen();
        if (element.tagName === "BODY") lastEl = element;
        // startClock();
      } else {
        document.exitFullscreen();
        lastEl = null;
        // stopClock();
      }
    }
  } catch (err) {
    console.log(err);
  }
};

export const map = function(value, in_min, in_max, out_min, out_max) {
  return ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};
