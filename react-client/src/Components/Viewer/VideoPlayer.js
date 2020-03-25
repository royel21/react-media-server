import React, { useState, useRef } from "react";
import { formatTime } from "../Shares/utils";
import Loading from "../Shares/Loading";

const VidePlayer = ({ file }) => {
  const player = useRef();
  const [config, setConfig] = useState({
    vol: 0.5,
    isMute: false,
    isPause: true,
    progress: file.CurrentPos || 0,
    Total: 0,
    seekStep: 5,
    isLoading: true
  });
  const playPause = () => {
    if (config.isPause) {
      player.current.play().catch(err => {});
    } else {
      player.current.pause();
    }
  };

  const onPause = e => {
    setConfig({ ...config, isPause: e.target.checked });
    playPause();
  };

  const onMute = e => {
    setConfig({ ...config, isMute: e.target.checked });
  };

  const onVolChange = e => {
    setConfig({ ...config, vol: e.target.value });
    player.current.volume = config.vol;
  };

  const onProgress = e => {
    setConfig({ ...config, progress: e.target.currentTime });
  };

  const onSeek = e => {
    player.current.currentTime = e.target.value;
  };

  const onMeta = e => {
    setConfig({ ...config, Total: e.target.duration, isLoading: false });
  };

  const playerMouseDown = e => {
    if (e.button === 0) {
      setConfig({ ...config, isPause: !config.isPause });
      playPause();
    }
  };

  const onWheel = e => {
    console.log(e.deltaY);
    let vol = config.vol;
    vol = e.deltaY > 0 ? vol + 0.1 : vol - 0.1;
    setConfig({ ...config, vol });
  };

  return (
    <div id="player-container">
      {config.isLoading && file.Id ? <Loading /> : ""}
      <div id="player-content" data-not-found={file.Id ? "" : "Video Not Found"}>
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
          onWheel={onWheel}
        />
        <div className="v-controls">
          <div className="v-seeker">
            <span id="v-progress">
              {formatTime(config.progress) + "/" + formatTime(config.Total)}
            </span>
            <input
              type="range"
              id="v-seek"
              min={0}
              max={config.Total}
              value={config.progress}
              onChange={onSeek}
            />
          </div>
          <div className="v-btns">
            <span id="hide-player">
              <i className="far fa-times-circle popup-msg" data-title="Close"></i>
            </span>
            <span id="v-prev">
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
                  onChange={onPause}
                  checked={config.isPause}
                />
                <i
                  className={`far fa-${config.isPause ? "play" : "pause"}-circle`}
                  data-title="Pause"
                ></i>
              </label>
            </span>
            <span id="v-next">
              <i
                className="far fa-arrow-alt-circle-right popup-msg"
                data-title="Next"
              ></i>
            </span>
            <span className="btn-fullscr">
              <i
                className="fas fa-expand-arrows-alt popup-msg"
                data-title="Full Screen"
              ></i>
            </span>
            <span className="v-vol">
              <input
                type="range"
                id="v-vol-control"
                className="range popup-msg"
                data-title="Volume"
                min="0"
                step="0.01"
                value={config.vol}
                max="1"
                onChange={onVolChange}
              />
              <label htmlFor="v-mute">
                <input
                  type="checkbox"
                  id="v-mute"
                  className="vol-ctrl"
                  checked={config.isMute}
                  onChange={onMute}
                />
                <span className="mute-icon"></span>
                <i className="fas fa-volume-up popup-msg" data-title="Mute"></i>
              </label>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(VidePlayer);
