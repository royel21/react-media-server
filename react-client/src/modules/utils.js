function formatTime(time) {
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

var clockTimer;
const getFDate = () =>
  new Date().toLocaleTimeString().replace(/(.*)\D\d+/, "$1");

function startClock(clock) {
  clock.classList.add("fade-out");
  clock.textContent = getFDate();
  clockTimer = setInterval(() => {
    clock.textContent = getFDate();
  }, 1000 * 60);
}

function stopClock(clock) {
  clock.classList.remove("fade-in");
  clock.addEventListener("webkitTransitionEnd transitionend", e => {
    clearInterval(clockTimer);
    clock.textContent = "";
  });
}

export default { formatTime, startClock, stopClock };
