import React, { useState, useRef, useCallback, useEffect } from "react";
import { formatTime } from "../Shares/utils";
import Slider from "@material-ui/core/Slider";
import Loading from "../Shares/Loading";
import Slider2 from "./Slider";
import "./slider.css";
import "./VideoPlayer.css";
import { KeyMap } from "./KeyMap";

const VidePlayer = ({
  file,
  auto = false,
  btnlist,
  nextFile,
  prevFile,
  setFullscreen
}) => {
  const player = useRef();
  const controlsRef = useRef(null);
  const focusRef = useRef(true);
  const [config, setConfig] = useState({
    vol: 0.3,
    isMute: false,
    isPause: true,
    progress: file.CurrentPos || 0,
    isLoading: true
  });

  const playPause = () => {
    setConfig({ ...config, isPause: !player.current.paused });
    if (player.current.paused) {
      player.current.play().catch(err => {});
    } else {
      player.current.pause();
    }
  };

  const onMute = e => {
    setConfig({ ...config, isMute: e.target.checked });
    player.current.muted = e.target.checked;
  };

  const onVolChange = useCallback(
    (e, newVol) => {
      setConfig({ ...config, newVol });
      player.current.volume = newVol;
    },
    [config]
  );

  const onProgress = e => {
    setConfig({ ...config, progress: e.target.currentTime });
  };

  const onSeek = value => {
    player.current.currentTime = value;
  };

  const onMeta = e => {
    setConfig({ ...config, isLoading: false });
    player.current.volume = config.vol;
    player.current.currentTime = config.progress;
  };

  const playerMouseDown = e => {
    if (e.button === 0) {
      setConfig({ ...config, isPause: !config.isPause });
      playPause();
    }
  };

  const onWheel = e => {
    let vol = config.vol;
    vol += e.deltaY < 0 ? 0.05 : -0.05;
    vol = vol < 0 ? 0 : vol > 1 ? 1 : vol;
    setConfig({ ...config, vol });
    player.current.volume = vol;
  };

  var timer;
  const hideControls = e => {
    if (controlsRef.current) {
      if (!timer) {
        controlsRef.current.style.opacity = 1;
        player.current.style.cursor = "initial";
        timer = setTimeout(() => {
          if (focusRef.current) {
            controlsRef.current.style.opacity = 0;
            player.current.style.cursor = "none";
          }
          clearTimeout(timer);
          timer = null;
        }, 2000);
      }
    }
  };

  const controlFocus = e => {
    focusRef.current = e.type === "mouseleave";
  };

  function volFormat(value) {
    return `${parseInt(value * 100)}%`;
  }

  const handleKeyDown = e => {
    console.log(e.keyCode);
  };

  KeyMap.VolumeUp.action = () => {
    let vol = config.vol + 0.1;
    setConfig({ ...config, vol: vol > 1 ? 1 : vol });
  };

  KeyMap.VolumeDown.action = () => {
    let vol = config.vol - 0.1;
    setConfig({ ...config, vol: vol < 0 ? 0 : vol });
  };

  KeyMap.SkipForward.action = () => {
    let next = config.progress + 5;
    onSeek(next > file.Duration ? file.Duration : next);
  };

  KeyMap.SkipBack.action = () => {
    let next = config.progress - 5;
    onSeek(next < 0 ? 0 : next);
  };

  KeyMap.PlayOrPause.action = playPause;

  useEffect(() => {
    player.current.volume = config.vol;
  }, [config]);

  return (
    <div id="player-container" onKeyDown={handleKeyDown} tabIndex={0}>
      {config.isLoading && file.Id ? <Loading /> : ""}
      <div
        id="player-content"
        data-not-found={file.Id ? "" : "Video Not Found"}
        onWheel={onWheel}
        onMouseMove={hideControls}
      >
        <div className="player">
          <video
            id="player"
            ref={player}
            src={`/api/videos/${file.Id || "0"}`}
            preload="metadata"
            controls={false}
            tabIndex="0"
            onTimeUpdate={onProgress}
            onLoadedMetadata={onMeta}
            onMouseDown={playerMouseDown}
            onDoubleClick={setFullscreen}
            autoPlay={auto}
          />
          <div
            className="v-controls"
            ref={controlsRef}
            onMouseEnter={controlFocus}
            onMouseLeave={controlFocus}
          >
            <div className="v-seeker">
              <span id="v-progress">
                {formatTime(config.progress) + "/" + formatTime(file.Duration)}
              </span>
              <Slider2
                id="v-slider"
                min={0}
                max={file.Duration}
                value={config.progress}
                onChange={onSeek}
                prew={true}
                previewContent={formatTime}
              />
            </div>
            <div className="v-btns">
              <span id="hide-player">
                <i className="far fa-times-circle popup-msg" data-title="Close"></i>
              </span>
              <span id="v-prev" onClick={prevFile}>
                <i
                  className="far fa-arrow-alt-circle-left popup-msg"
                  data-title="Previous"
                ></i>
              </span>
              <span id="v-play-pause">
                <label htmlFor="v-play">
                  <input
                    type="checkbox"
                    id="v-play"
                    onChange={playPause}
                    checked={config.isPause}
                  />
                  <i
                    className={`far fa-${config.isPause ? "play" : "pause"}-circle`}
                    data-title="Pause"
                  ></i>
                </label>
              </span>
              <span id="v-next" onClick={nextFile}>
                <i
                  className="far fa-arrow-alt-circle-right popup-msg"
                  data-title="Next"
                ></i>
              </span>
              <span className="btn-fullscr" onClick={setFullscreen}>
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
                {/* <input="range"
                min={0}
                max={1}
                step={0.1}
                value={config.vol}
                onChange={onVolChange}
                prew={false}
              /> */}
                <Slider
                  id="player-vol"
                  min={0}
                  max={1}
                  value={config.vol}
                  onChange={onVolChange}
                  step={0.01}
                  valueLabelDisplay="auto"
                  valueLabelFormat={volFormat}
                />
                <label htmlFor="v-mute">
                  <input
                    type="checkbox"
                    id="v-mute"
                    className="vol-ctrl"
                    checked={config.isMute}
                    onChange={onMute}
                  />
                  <i className="fas fa-volume-up popup-msg" data-title="Mute"></i>
                </label>
              </span>
            </div>
          </div>
        </div>
        <div className="footer">
          <h5>{file.Name}</h5>
          <span id="view" className="badge bg-light text-dark float-right">
            View {file.ViewCount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VidePlayer;
