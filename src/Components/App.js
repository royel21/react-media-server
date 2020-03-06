import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Navbar from "./Navbar";
import Main from "./Main";
import Mangas from "./Mangas";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBook,
  faFilm,
  faClipboardList,
  faTags,
  faHeart,
  faUserAlt,
  faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faBook,
  faFilm,
  faClipboardList,
  faTags,
  faHeart,
  faUserAlt,
  faSignOutAlt
);

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Switch>
        <Route path="/mangas" component={Mangas} />
        <Route path="/" component={Main} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
