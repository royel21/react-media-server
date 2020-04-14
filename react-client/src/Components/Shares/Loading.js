import React from "react";

const Loading = () => {
  return (
    <div className="loading files-list">
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
