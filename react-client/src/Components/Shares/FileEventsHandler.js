import { getFilesPerPage } from "./utils";
const UP = 38;
const DOWN = 40;
const LEFT = 37;
const RIGHT = 39;
const ENTER = 13;
const HOME = 36;
const END = 35;
var selectedIndex = 0;

const calCol = () => {
  let file = document.querySelector(".file");
  return Math.floor(file.parentElement.offsetWidth / file.offsetWidth);
};

const getElByIndex = index => {
  return [...document.querySelectorAll(".file")][index];
};

const getElementIndex = element => {
  return [...document.querySelectorAll(".file")].indexOf(element);
};

const selectItem = index => {
  selectedIndex = index;
  let nextEl = getElByIndex(index);

  if (nextEl) {
    let itemContainer = nextEl.parentElement;
    let scrollElement = itemContainer.parentElement;
    let scroll = scrollElement.scrollTop,
      elofft = nextEl.offsetTop;

    if (elofft - scroll + 1 < -1) {
      scroll = elofft < 60 ? 0 : elofft;
    }

    let top = elofft + nextEl.offsetHeight;
    let sctop = scroll + scrollElement.offsetHeight;

    if (top - sctop + 1 > 0) {
      scroll =
        top + 31 > itemContainer.offsetHeight
          ? itemContainer.offsetHeight - 10
          : scroll + (top - sctop);
    }

    scrollElement.scroll({
      top: scroll,
      behavior: "auto"
    });

    let activeEl = document.querySelector(".file.active");
    if (activeEl) activeEl.classList.remove("active");

    nextEl.classList.add("active");
    nextEl.focus();
    window.local.setItem("selected", index);
  }
  return nextEl;
};

const fileClicks = (element, processFile) => {
  if (element.classList.contains("fa-star")) return;

  if (element.id === "process-file") {
    processFile(element.closest(".file"));
  } else selectItem(getElementIndex(element.closest(".file")));
};

const fileKeypress = (e, page, goToPage, processFile) => {
  let file = document.querySelector(".file");
  if (file) {
    let wasProcesed = false;
    let colNum = calCol();
    let totalitem = document.querySelectorAll(".file").length;
    selectedIndex = getElementIndex(file.parentElement.querySelector(".active"));
    switch (e.keyCode) {
      case ENTER: {
        processFile(e);
        break;
      }
      case LEFT: {
        if (selectedIndex > 0) {
          selectItem(selectedIndex - 1);
        } else if (goToPage) {
          window.local.setItem("selected", getFilesPerPage(3) - 1);
          goToPage(page - 1);
        }

        wasProcesed = true;
        break;
      }
      case UP: {
        if (goToPage && e.ctrlKey) {
          window.local.setItem("selected", getFilesPerPage(3) - 1);
          goToPage(page - 1);
        } else if (selectedIndex - colNum >= 0) {
          selectItem(selectedIndex - colNum);
        }
        wasProcesed = true;
        break;
      }
      case RIGHT: {
        if (selectedIndex < totalitem - 1) {
          selectItem(selectedIndex + 1);
        } else if (goToPage) {
          window.local.setItem("selected", 0);
          goToPage(parseInt(page) + 1);
        }

        wasProcesed = true;
        break;
      }

      case DOWN: {
        if (goToPage && e.ctrlKey) {
          window.local.setItem("selected", 0);
          goToPage(parseInt(page) + 1);
        } else if (selectedIndex + colNum < totalitem) {
          selectItem(selectedIndex + colNum);
        }
        wasProcesed = true;
        break;
      }
      case HOME: {
        selectItem(0);
        wasProcesed = true;
        break;
      }
      case END: {
        selectItem(totalitem - 1);
        wasProcesed = true;
        break;
      }
      default: {
      }
    }

    if (wasProcesed) {
      e.preventDefault();
    }
  }
};

export { fileClicks, fileKeypress };
