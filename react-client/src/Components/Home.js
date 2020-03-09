import React, { Component } from "react";

class Home extends Component {
  addHistory = () => {
    console.log(this.props.history);
  };

  render() {
    document.title = "Home";
    return (
      <React.Fragment>
        <h1>Main</h1>
        <div>
          <button onClick={this.addHistory}>add history</button>
        </div>
      </React.Fragment>
    );
  }
}

export default Home;
