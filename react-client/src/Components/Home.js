import React from "react";

const Home = ({ history }) => {
  addHistory = () => {
    console.log(this.props.history);
  };

  document.title = "Home";
  return (
    <React.Fragment>
      <h1>Main</h1>
      <div>
        <button onClick={this.addHistory}>add history</button>
      </div>
    </React.Fragment>
  );
};

export default Home;
