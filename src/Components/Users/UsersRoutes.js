import React, { Fragment } from "react";
import { Switch, Route } from "react-router-dom";

import Navbar from "./Navbar";
import Home from "./Home/Home";
import Folders from "./Folders";
import Mangas from "./Mangas";
import Favorites from "./Favorites/Favorites";
import Videos from "./Videos";
import Viewer from "./Viewer/Viewer";

import "./User.css";

const UsersRoutes = () => {
  return (
    <Fragment>
      <Navbar />
      <div id="user-content" className="content">
        <Switch>
          <Route
            path={["/folders/:page?/:filter?", "/folder-content/:id/:page?/:filter?"]}
            component={Folders}
          />
          <Route path="/mangas/:page?/:filter?" component={Mangas} />
          <Route path="/videos/:page?/:filter?" component={Videos} />
          <Route path="/favorites/:id?/:page?/:filter?" component={Favorites} />
          <Route path="/viewer/:type/:id/:fileId?" component={Viewer} />
          <Route exact path="/" component={Home} />
          <Route path="/*" component={""} />
        </Switch>
      </div>
    </Fragment>
  );
};

export default UsersRoutes;
