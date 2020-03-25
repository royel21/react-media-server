import React from "react";

const Loading = () => {
  return (
    <div id="files-list" className="loading">
      <div className="loading">
        <h3>Loading...</h3>
        <div className="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
