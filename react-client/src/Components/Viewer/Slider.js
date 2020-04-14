import React, { useRef, useState, useCallback } from "react";
import { map } from "../Shares/utils";

let isMdown = { is: false };

const progressStyle = {
  full: {
    borderRadius: "0.3rem"
  },
  inProgress: {
    borderRadius: "0.3rem 0px 0px 0.3rem"
  }
};

const Slider = ({ min, max, value, onChange, previewContent, prew }) => {
  const [previewData, setpreviewData] = useState({ pos: 0, value: 0 });
  const [uniqId] = useState("rc-" + new Date().getTime());
  const sliderRef = useRef(null);
  const previewRef = useRef({ current: { offsetWidth: 0 } });
  const progress = map(value, min, max, 0, 100);

  const onMDown = e => {
    isMdown = { is: true, id: uniqId };
    let xpos;

    if (e.nativeEvent.type === "touchstart") {
      xpos = e.touches[0].pageX - e.touches[0].target.getBoundingClientRect().left;
      document.addEventListener("touchmove", globalMMove);
    } else {
      xpos = e.nativeEvent.offsetX;
      document.addEventListener("mousemove", globalMMove);
    }

    if (!isNaN(xpos)) {
      updateValue(xpos);
    }
  };

  const updateValue = useCallback(
    val => {
      let tempVal = Number(
        map(val - 1, 0, sliderRef.current.offsetWidth - 2, min, max).toFixed(2)
      );
      tempVal = tempVal < 0 ? 0 : tempVal > max ? max : tempVal;
      if (onChange) {
        onChange(tempVal);
      }
    },
    [min, max, onChange]
  );

  const globalMMove = useCallback(
    e => {
      if (
        (isMdown.is && e.target.id === uniqId) ||
        (e.type === "touchmove" && e.touches[0].target.id === uniqId)
      ) {
        let newPos;
        if (e.type === "touchmove") {
          newPos = e.touches[0].pageX - e.touches[0].target.getBoundingClientRect().left;
        } else {
          newPos = e.offsetX;
        }
        if (newPos > 0 && newPos < sliderRef.current.offsetWidth) {
          updateValue(newPos);
        }
      }
    },
    [updateValue, uniqId]
  );

  const onPreview = e => {
    if (prew) {
      var newPos = Math.floor(e.pageX - sliderRef.current.getBoundingClientRect().left);
      var pos = map(newPos - 1, 0, sliderRef.current.offsetWidth - 2, 0, 100).toFixed(0);
      let tempVal = Number(
        map(newPos - 1, 0, sliderRef.current.offsetWidth - 2, min, max).toFixed(2)
      );
      pos = pos < 0 ? 0 : pos > 100 ? 100 : pos;
      setpreviewData({ pos, value: tempVal < 0 ? 0 : tempVal > max ? max : tempVal });
    }
  };

  document.onmouseup = e => {
    isMdown = false;
    document.removeEventListener("mousemove", globalMMove);
    document.removeEventListener("touchmove", globalMMove);
  };

  const handleThumb = e => {
    isMdown = { is: true, id: uniqId };
    if (e.nativeEvent.type === "touchstart") {
      document.addEventListener("touchmove", globalMMove);
    } else {
      document.addEventListener("mousemove", globalMMove);
    }
    e.stopPropagation();
  };

  return (
    <div className="rc-slider">
      <div
        id={uniqId}
        className="rc-track"
        onMouseDown={onMDown}
        onTouchEnd={onmouseup}
        onTouchStart={onMDown}
        ref={sliderRef}
        onMouseMove={onPreview}
      >
        <div
          className="rc-progress"
          style={{
            ...(Math.round(progress) === 100
              ? progressStyle.full
              : progressStyle.inProgress),
            width: (progress > 0.3 ? progress : 0) + "%"
          }}
        ></div>
        <span
          className="rc-thumb"
          style={{ left: `calc(${progress}% - 11px)` }}
          onMouseDown={handleThumb}
        ></span>
        {prew ? (
          <span
            className="rc-preview"
            ref={previewRef}
            data-title="00:00"
            style={{
              left: `calc(${previewData.pos}% - ${previewRef.current.offsetWidth / 2}px)`
            }}
          >
            <span className="rc-preview-content">
              {previewContent(previewData.value)}
            </span>
          </span>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default React.memo(Slider);
