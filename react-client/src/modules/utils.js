var clockTimer;
const getFDate = () => new Date().toLocaleTimeString().replace(/(.*)\D\d+/, "$1");

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

export default { startClock, stopClock };
