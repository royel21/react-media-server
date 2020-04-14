import React, { useContext, useState, Fragment } from "react";

import { PageConfigContext } from "../Context/PageConfigContext";

const UserConfig = ({ User }) => {
  const { pageConfig, setPageConfig } = useContext(PageConfigContext);
  const [localConfig, setLocalConfig] = useState(pageConfig);
  const filePerPage = e => {
    let val = e.target.value;
    val = val >= 0 ? val : 0;
    val = val <= 501 ? val : 500;

    setLocalConfig({ order: localConfig.order, items: parseInt(val) });
  };

  const applyChanges = () => {
    setPageConfig({ ...pageConfig, ...localConfig });
  };
  return (
    <Fragment>
      <label htmlFor="show-config">
        <i className="fas fa-user-cog" />
        <span>{User.username}</span>
      </label>
      <input type="checkbox" name="" id="show-config" />
      <div id="user-config">
        <h4>Page Config</h4>
        <div id="config-content">
          <div className="page-control">
            <label>Sort By: </label>
            <select
              name="orderby"
              id="order-select"
              onChange={e =>
                setLocalConfig({
                  order: e.target.value,
                  items: pageConfig.items
                })
              }
            >
              <option value="nu">&#xf15d; Name</option>
              <option value="nd">&#xf15e; Name</option>
              <option value="du">&#xf162; Date</option>
              <option value="dd">&#xf163; Date</option>
            </select>
          </div>
          <div className="page-control">
            <label>File per Page: </label>
            <input
              type="number"
              name="fperpage"
              id="fperpage"
              min="0"
              max="500"
              value={localConfig.items || 0}
              onChange={filePerPage}
            />
            <span id="fpp-tips">0 = auto, max 500</span>
          </div>
          <div className="bottom-controls">
            <span id="btn-save" className="btn" onClick={applyChanges}>
              Save
            </span>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default UserConfig;
