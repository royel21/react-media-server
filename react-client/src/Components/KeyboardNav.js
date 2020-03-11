const UP = 38;
const DOWN = 40;
const LEFT = 37;
const RIGHT = 39;
const ENTER = 13;
const HOME = 36;
const END = 35;
var selectedIndex = 0;

const calCol = () => {
  return Math.floor(
    document.getElementById("files-list").offsetWidth /
      document.querySelector(".file").offsetWidth
  );
};
const getElByIndex = index => {
  return [...document.querySelectorAll(".file")][index];
};

const getElementIndex = element => {
  return [...document.querySelectorAll(".file")].indexOf(element);
};

const selectItem = index => {
  let scrollElement = document.querySelector(".content");
  let itemContainer = document.getElementById("files-list");
  selectedIndex = index;
  let nextEl = getElByIndex(index);
  if (nextEl !== undefined) {
    let scroll = scrollElement.scrollTop,
      elofft = nextEl.offsetTop;

    if (elofft - scroll + 1 < -1) {
      scroll = elofft < 60 ? 0 : elofft;
    }

    let top = elofft + nextEl.offsetHeight;
    let sctop = scroll + scrollElement.offsetHeight;
    if (top - sctop + 1 > 0) {
      scroll =
        top > itemContainer.offsetHeight
          ? itemContainer.offsetHeight + 50
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
  }
  return nextEl;
};

const fileNavClick = e => {
  selectItem(getElementIndex(e.target.closest(".file")));
};

const fileNavKeydown = e => {
  if (!e.target.closest(".controls")) {
    let wasProcesed = false;
    let colNum = calCol();
    let totalitem = document.querySelectorAll(".file").length;
    switch (e.keyCode) {
      case ENTER: {
        break;
      }
      case LEFT: {
        if (selectedIndex > 0) {
          selectItem(selectedIndex - 1);
        }
        // if (currentPage > 1 || e.ctrlKey && currentPage > 1) {

        //     let url = genUrl(currentPage - 1);
        //     loadPartialPage(url, () => {
        //         selectItem($('.items').length - 1);
        //     });
        // }

        wasProcesed = true;
        break;
      }
      case UP: {
        if (e.ctrlKey) {
          // goBack();
        } else if (selectedIndex - colNum >= 0) {
          selectItem(selectedIndex - colNum);
        }
        wasProcesed = true;
        break;
      }
      case RIGHT: {
        if (selectedIndex < totalitem - 1) {
          selectItem(selectedIndex + 1);
        }
        // if (currentPage < totalPage || e.ctrlKey && currentPage < totalPage) {

        //     let url = genUrl(currentPage + 1);
        //     loadPartialPage(url, () => {
        //         selectItem(0);
        //     });
        // }

        wasProcesed = true;
        break;
      }

      case DOWN: {
        if (selectedIndex + colNum < totalitem) {
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

export { fileNavClick, fileNavKeydown };
