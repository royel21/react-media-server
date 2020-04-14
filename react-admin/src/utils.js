window.local = localStorage;

Storage.prototype.setObject = function(key, value) {
  this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function(key) {
  let value = this.getItem(key);
  if (value === "undefined") return {};
  try {
    value = JSON.parse(value);
  } catch (err) {
    console.log(err);
  }
  return value;
};

window.lastEl = null;

window.setfullscreen = element => {
  try {
    if (window.lastEl && element.tagName !== "BODY") {
      if (document.fullscreenElement.tagName === "BODY") {
        document.exitFullscreen().then(() => {
          element.requestFullscreen();
        });
      } else {
        document.exitFullscreen().then(() => {
          window.lastEl.requestFullscreen();
        });
      }
    } else {
      if (!document.fullscreenElement) {
        element.requestFullscreen();
        if (element.tagName === "BODY") window.lastEl = element;
        // startClock();
      } else {
        document.exitFullscreen();
        window.lastEl = null;
        // stopClock();
      }
    }
  } catch (err) {
    console.log(err);
  }
};
