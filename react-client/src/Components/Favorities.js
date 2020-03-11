import React from "react";

const Favorities = ({ history }) => {
  const addHistory = () => {
    console.log(history);
  };
  console.log(window.location.pathname);

  document.title = "Favorities";
  return (
    <React.Fragment>
      <h1>Favorities</h1>
      <div></div>
    </React.Fragment>
  );
};

export default Favorities;
