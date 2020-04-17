import React from "react";
import "./TestComponent.css";
import { useState } from "react";

const TestComponent = () => {
  const [page, setPage] = useState(3);
  const imgs = [
    "/Umi/01.jpg",
    "/Umi/02.jpg",
    "/Umi/03.png",
    "/Umi/04.png",
    "/Umi/05.png",
    "/Umi/06.png",
    "/Umi/07.png",
    "/Umi/08.png",
  ];
  let { length } = imgs;
  const nextPage = () => {
    let pg = page + 1;
    pg = pg > length - 1 ? length - 1 : pg;
    setPage(pg);
  };

  const prevPage = () => {
    let pg = page - 1;
    pg = pg < 0 ? 0 : pg;
    console.log(pg);
    setPage(pg);
  };

  return (
    <div id="manga-viewer" className="card bg-dark">
      <div className="viewer">
        <div className="img-current">
          <img src={imgs[page]} alt="" />
        </div>
      </div>
      <div className="controls">
        <span className="prev-file">
          <i className="fa fa-backward"></i>
        </span>
        <span className="prev-page" onClick={prevPage}>
          <i className="fa fa-arrow-circle-left"></i>
        </span>
        <span className="current-page">{`${page + 1}/${length}`}</span>
        <span className="next-page" onClick={nextPage}>
          <i className="fa fa-arrow-circle-right"></i>
        </span>
        <span className="next-page">
          <i className="fa fa-forward"></i>
        </span>
      </div>
    </div>
  );
};

export default TestComponent;
