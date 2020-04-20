import React, { useState, useRef, useEffect } from "react";

import Loading from "../Shares/Loading";
import Slider2 from "./Slider";
import "./slider.css";
import "./VideoPlayer.css";

import { formatTime } from "../Shares/utils";
import { KeyMap } from "../../Shares/KeyMap";
import { useHistory } from "react-router-dom";
import useGesture from "../hooks/useGesture";

const VidePlayer = ({ configMedia, file, btnlist, socket }) => {
  const history = useHistory();
  // Context
  // Element References
  const player = useRef();
  const controlsRef = useRef(null);
  const focusRef = useRef(true);
  const fileRef = useRef({ Id: "" });
  // States
  const [mConfig, setMConfig] = useState(configMedia);
  const [progress, setProgress] = useState(file.CurrentPos);
  const [isLoading, setIsLoading] = useState(true);

  if (fileRef.current.Id !== file.Id) {
    if (player.current) {
      let pos = player.current.currentTime;
      socket.emit("file-update-pos", { id: fileRef.current.Id, pos });
    }
    fileRef.current = file;
    setIsLoading(true);
  }

  // Start or stop the playback
  const playPause = () => {
    setMConfig({ ...mConfig, pause: !player.current.paused });
    if (player.current.paused) {
      player.current.play().catch((err) => {});
    } else {
      player.current.pause();
    }
    socket.emit("file-update-pos", {
      id: fileRef.current.Id,
      pos: progress,
    });
  };
  // Mute the player
  const onMute = (e) => {
    setMConfig({ ...mConfig, mute: e.target.checked });
  };
  // change volumen
  const onVolChange = (e) => {
    setMConfig({ ...mConfig, volume: parseFloat(e.target.value) });
  };
  // update the progressbar
  const onProgress = (e) => {
    setProgress(e.target.currentTime);
  };
  // seek playback position
  const onSeek = (value) => {
    player.current.currentTime = value;
  };
  // config info after video is loaded
  const onMeta = (e) => {
    player.current.currentTime = file.CurrentPos;
    setIsLoading(false);
  };

  // handle wheel scroll to change volumen
  const onWheel = (e) => {
    let { volume } = mConfig;
    volume += e.deltaY < 0 ? 0.05 : -0.05;
    volume = volume < 0 ? 0 : volume > 1 ? 1 : volume;
    setMConfig({ ...mConfig, volume });
  };
  // setup auto hide controls of the player

  const onReturn = () => {
    let lastLoc = localStorage.getItem("lastLoc");
    if (lastLoc) history.push(lastLoc);
  };

  const controlFocus = (e) => {
    let ctrls = document.querySelector(".v-controls");
    let progress2 = ctrls.previousElementSibling;

    if (e.type === "mouseleave") {
      ctrls.style.opacity = 0;
      progress2.style.opacity = 1;
    } else {
      progress2.style.opacity = 0;
      ctrls.style.opacity = 1;
    }
    focusRef.current = e.type === "mouseleave";
  };

  // function volFormat(value) {
  //   return `${parseInt(value * 100)}%`;
  // }

  KeyMap.VolumeUp.action = () => {
    let vol = mConfig.volume + 0.05;
    setMConfig({ ...mConfig, volume: vol > 1 ? 1 : vol });
  };

  KeyMap.VolumeDown.action = () => {
    let vol = mConfig.volume - 0.05;
    setMConfig({ ...mConfig, volume: vol < 0 ? 0 : vol });
  };

  KeyMap.SkipForward.action = (isCtrl) => {
    let next = progress + (isCtrl ? 10 : 5);
    onSeek(next > file.Duration ? file.Duration : next);
  };

  KeyMap.SkipBack.action = (isCtrl) => {
    let next = progress - (isCtrl ? 10 : 5);
    onSeek(next < 0 ? 0 : next);
  };

  KeyMap.PlayOrPause.action = playPause;

  useEffect(() => {
    player.current.volume = mConfig.volume;
    player.current.muted = mConfig.mute;
    socket.emit("video-config", { config: mConfig });
  }, [mConfig, socket]);

  const hideMenu = (e) => {
    e.preventDefault();
  };

  const { onTouchStart, onTouchEnd, onTouchMove } = useGesture(
    player,
    KeyMap.Fullscreen.action,
    playPause,
    mConfig,
    setMConfig
  );

  const onPlayEnd = () => {
    if (KeyMap.NextFile.action) {
      let tout = setTimeout(() => {
        KeyMap.NextFile.action({ Id: file.Id, CurrentPos: progress });
        clearTimeout(tout);
      }, 4000);
    }
  };
  const resize = () => {
    if (document.fullscreenElement) {
      player.current.style.height = "100%";
    } else {
      let w = document.getElementById("player-content").offsetWidth;
      player.current.style.height = w * 0.5625 + "px";
      console.log("resize:", w);
    }
  };
  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  let progressVal = formatTime(progress) + "/" + formatTime(file.Duration);
  return (
    <div id="player-container">
      {isLoading ? <Loading /> : ""}
      <div
        id="player-content"
        data-not-found={file.Id ? "" : "Video Not Found"}
        onWheel={onWheel}
      >
        <div className="player">
          <video
            id="player"
            ref={player}
            src={`/api/videos/${file.Id || "0"}`}
            preload="metadata"
            controls={false}
            onTimeUpdate={onProgress}
            onLoadedMetadata={onMeta}
            onContextMenu={hideMenu}
            autoPlay={!mConfig.pause}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onMouseDown={onTouchStart}
            onMouseUp={onTouchEnd}
            onTouchMove={onTouchMove}
            poster={file.Cover}
            loop={false}
            onEnded={onPlayEnd}
          />
          <span id="v-progress2" style={{ opacity: mConfig.pause ? "0" : "1" }}>
            {progressVal}
          </span>
          <div
            className={"v-controls"}
            ref={controlsRef}
            onMouseEnter={controlFocus}
            onMouseLeave={controlFocus}
            style={{ opacity: !mConfig.pause ? "0" : "1" }}
          >
            <div className="v-seeker">
              <span id="v-progress">{progressVal}</span>
              <Slider2
                id="v-slider"
                min={0}
                max={file.Duration}
                value={progress}
                onChange={onSeek}
                prew={true}
                previewContent={formatTime}
              />
            </div>
            <div className="v-btns">
              <span id="hide-player" onClick={onReturn}>
                <i
                  className="far fa-times-circle popup-msg"
                  data-title="Close"
                ></i>
              </span>
              {btnlist ? (
                <span
                  id="v-prev"
                  onClick={() => {
                    KeyMap.PrevFile.action &&
                      KeyMap.PrevFile.action({
                        Id: file.Id,
                        CurrentPos: progress,
                      });
                  }}
                >
                  <i
                    className="far fa-arrow-alt-circle-left popup-msg"
                    data-title="Previous"
                  ></i>
                </span>
              ) : (
                ""
              )}
              <span id="v-play-pause">
                <label htmlFor="v-play">
                  <input
                    type="checkbox"
                    id="v-play"
                    onChange={playPause}
                    checked={mConfig.pause}
                  />
                  <i
                    className={`far fa-${
                      mConfig.pause ? "play" : "pause"
                    }-circle`}
                    data-title="Pause"
                  ></i>
                </label>
              </span>
              {btnlist ? (
                <span
                  id="v-next"
                  onClick={() => {
                    KeyMap.NextFile.action &&
                      KeyMap.NextFile.action({
                        Id: file.Id,
                        CurrentPos: progress,
                      });
                  }}
                >
                  <i
                    className="far fa-arrow-alt-circle-right popup-msg"
                    data-title="Next"
                  ></i>
                </span>
              ) : (
                ""
              )}
              <span className="btn-fullscr" onClick={KeyMap.Fullscreen.action}>
                <i
                  className="fas fa-expand-arrows-alt popup-msg"
                  data-title="Full Screen"
                ></i>
              </span>
              {btnlist ? (
                <span>
                  <label className="p-sort" htmlFor="p-hide">
                    <i className="fas fa-list"></i>
                  </label>
                </span>
              ) : (
                ""
              )}
              <span className="v-vol">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={mConfig.volume}
                  onChange={onVolChange}
                />
                <label htmlFor="v-mute">
                  <input
                    type="checkbox"
                    id="v-mute"
                    className="vol-ctrl"
                    checked={mConfig.mute}
                    onChange={onMute}
                  />
                  <i
                    className="fas fa-volume-up popup-msg"
                    data-title="Mute"
                  ></i>
                </label>
              </span>
            </div>
          </div>
        </div>
        <div id={mConfig.pause ? "filename" : ""} className={"footer"}>
          <span>{file.Name}</span>
          <span>View {file.ViewCount}</span>
        </div>
      </div>
    </div>
  );
};

export default VidePlayer;
