import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Navbar from "./Navbar";
import Main from "./Main";
import Mangas from "./Mangas";
import Videos from "./Videos";

import { fileNavClick, fileNavKeydown } from "./KeyboardNav";
import "./PageControls.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div
        className="content"
        onClick={fileNavClick}
        onKeyDown={fileNavKeydown}
      >
        <Switch>
          <Route path="/mangas/:order/:page?/:filter?" component={Mangas} />
          <Route path="/videos/:order/:page?/:filter?" component={Videos} />
          <Route path="/" component={Main} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
