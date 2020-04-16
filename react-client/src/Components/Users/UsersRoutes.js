import React from "react";
import { Switch, Route } from "react-router-dom";

import Navbar from "./Navbar";
import Home from "./Home/Home";
import Folders from "./Folders";
import Mangas from "./Mangas";
import Favorites from "./Favorites/Favorites";
import Videos from "./Videos";
import LoginRedirct from "./LoginRedirect";

import PageConfigContextProvider from "../../Context/PageConfigContext";
import FavoriteContextProvider from "../../Context/FavoriteContext";
import Viewer from "./Viewer/Viewer";

import "../Shares/PageControls.css";

const UsersRoutes = () => {
  return (
    <PageConfigContextProvider config={User.Config}>
      <Navbar setUser={setUser} User={User} />
      <FavoriteContextProvider favorites={User.favorites}>
        <div id="content">
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
            <Route
              path="/*"
              render={(props) => <LoginRedirct {...props} Auth={User.isAutenticated} />}
            />
          </Switch>
        </div>
      </FavoriteContextProvider>
    </PageConfigContextProvider>
  );
};

export default UsersRoutes;
