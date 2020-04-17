import React, { Fragment } from "react";
import { Switch, Route } from "react-router-dom";

import Navbar from "./Navbar";
import UsersManager from "./Users/UsersManager.js";
import FilesManager from "./FilesManager/FilesManager.js";
import DiskManager from "./DisManager/DiskManager.js";
import FoldersManager from "./Folders/FoldersManager.js";

import "./AdminRoute.css";
import "./Shares/Modals.css";

function AdminRoute({ User, setUser }) {
  return (
    <Fragment>
      <Navbar User={User} setUser={setUser} />
      <div id="admin-content" className="content">
        <Switch>
          <Route exact path={["/", "/users"]} component={UsersManager} />
          <Route path="/files/:page?/:items?/:filter?" component={FilesManager} />
          <Route path="/folders/:page?" component={FoldersManager} />
          <Route path="/disk" component={DiskManager} />
        </Switch>
      </div>
    </Fragment>
  );
}

export default AdminRoute;
