import { KeyMap } from "../../Shares/KeyMap";

// const initialData = {
//   startX: 0,
//   endPosX: 0,
//   startY: 0,
//   endY: 0,
//   time: 0,
// };

var startClick = 0;

// var touching = false;
// var gestureDir = 0;
// var touchData = { ...initialData };

const { Fullscreen, SkipForward, SkipBack, ShowList } = KeyMap;
const useGesture = (nextFile, prevFile) => {
  //   const [touchData, setTouchData] = useState(initialData);

  const onTouchStart = (e) => {
    // touching = true;
    // let time = e.timeStamp;
    let { pageX, pageY } = (e.touches && e.touches[0]) || e;
    if (e.type !== "mousedown") {
      // touchData = { time, startX: pageX, startY: pageY };
    } else {
      startClick++;
      if (startClick === 1) {
        setTimeout(function () {
          if (startClick === 1) {
            let w = window.innerWidth;
            if (pageY > window.innerHeight * 0.75) {
              if (pageX < w * 0.25) {
                prevFile();
              } else if (pageX < w * 0.75) {
                ShowList.action();
              } else {
                nextFile();
              }
            } else {
              if (pageX < w * 0.25) {
                SkipBack.action();
              } else if (pageX < w * 0.75) {
                Fullscreen.action();
              } else {
                SkipForward.action();
              }
            }
          } else {
            Fullscreen.action();
          }
          startClick = 0;
        }, 200);
      }
    }
  };

  const onTouchMove = (e) => {
    // if (touching) {
    //   let { pageX, pageY } = e.touches[0];
    //   //   setTouchData({ ...touchData, endX: pageX, endY: pageY });
    //   let { startX, startY } = touchData;
    //   let deltaX = pageX - startX;
    //   let deltaY = pageY - startY;
    //   if (deltaX < 0) {
    //     setShowFileList(true);
    //   } else {
    //     setShowFileList(false);
    //   }
    // }
  };

  const onTouchEnd = (e) => {
    // touching = false;
    // if (e.type === "touchend") {
    // }
    // // setTouchData(initialData);
    // touchData = { initialData };
    // gestureDir = 0;
  };

  return { onTouchStart, onTouchEnd, onTouchMove };
};

export default useGesture;
