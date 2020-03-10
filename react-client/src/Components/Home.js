import React from "react";

const Home = ({ history }) => {
  const addHistory = () => {
    console.log(history);
  };
  console.log(window.location.pathname);

  document.title = "Home";
  return (
    <React.Fragment>
      <h1>Main</h1>
      <div>
        <button onClick={addHistory}>add history</button>
      </div>
    </React.Fragment>
  );
};

export default Home;
