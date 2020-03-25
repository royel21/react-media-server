import React, { useEffect, useState, Fragment } from "react";
import { useParams } from "react-router-dom";

import "./Viewer.css";

import VidePlayer from "./VideoPlayer";
import PlayList from "./PlayList";
import Axios from "axios";
import Loading from "../Shares/Loading";

const TypeList = ["folder", "favorite"];

const Viewer = () => {
  const { type, id, fileId } = useParams();

  const [viewerData, setViewerData] = useState({
    playList: [],
    file: {},
    isLoading: true
  });

  useEffect(() => {
    Axios.post(`/api/videos/${type}`, { id }).then(({ data }) => {
      if (data.fail) {
        console.log(data.msg);
      } else {
        if (TypeList.includes(type)) {
          let f = data.find(tf => tf.Id === fileId);
          setViewerData({ playList: data, file: f || {}, isLoading: false });
        } else {
          setViewerData({ playList: [], file: data, isLoading: false });
        }
      }
    });
  }, [type, id, fileId]);

  return (
    <Fragment>
      {viewerData.isLoading ? (
        <Loading />
      ) : (
        <div id="viewer">
          <VidePlayer file={viewerData.file} />
          {viewerData.playList.length > 0 ? <PlayList {...viewerData} type={type} /> : ""}
        </div>
      )}
    </Fragment>
  );
};

export default Viewer;
