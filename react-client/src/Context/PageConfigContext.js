import React, { createContext, useState } from "react";

export const PageConfigContext = createContext();

const PageConfigContextProvider = props => {
  const [pageConfig, setPageConfig] = useState({
    order: "nu",
    items: 0
  });

  return (
    <PageConfigContext.Provider value={{ pageConfig, setPageConfig }}>
      {props.children}
    </PageConfigContext.Provider>
  );
};

export default PageConfigContextProvider;
