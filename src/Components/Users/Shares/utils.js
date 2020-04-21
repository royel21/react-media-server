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

export const getFilesPerPage = (i) => {
  let fList = document.querySelector(".files-list");
  let items = 9;
  if (fList) {
    let fwidth = fList.offsetWidth;
    items = parseInt((fwidth - scrollW) / itemW);
  }
  return items * i;
};

export const genUrl = (page, { order, items }, filter, type, notApi, id) => {
  let itemsperpage = (items || 0) === 0 ? getFilesPerPage(3) : items;
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
  "folder-content": "Folder-content",
};

export const FileTypes = {
  Manga: {
    type: "mangas",
    class: "book-open",
    formatter(a, b) {
      return `${a}/${b}`;
    },
  },
  Video: {
    type: "videos",
    class: "play-circle",
    formatter(a, b) {
      return `${formatTime(a)}/${formatTime(b)}`;
    },
  },
  Folder: {
    type: "folders",
    class: "folder-open",
    formatter() {
      return "";
    },
  },
};

var lastEl = null;

export const setfullscreen = (element) => {
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
      } else {
        document.exitFullscreen();
        lastEl = null;
      }
    }
  } catch (err) {
    console.log(err);
  }
};

export const map = function (value, in_min, in_max, out_min, out_max) {
  return ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};

export const ProcessFile = (file, history) => {
  switch (file.dataset.type) {
    case "Manga":
    case "Video": {
      localStorage.setItem("lastLoc", history.location.pathname);
      let tdata = history.location.pathname.split("/");
      let playType = tdata[1];
      let id = tdata[2];

      let url = `/viewer/`;
      if (id) {
        url += `${playType.replace("-content", "")}/${id}/${file.id}`;
      } else {
        url += `file/${file.id}`;
      }

      history.push(url);
      break;
    }
    default: {
      window.local.setObject("folder", {
        folder: file.id,
        pathname: window.location.pathname,
      });
      history.push(`/folder-content/${file.id}/1`);
    }
  }
};
