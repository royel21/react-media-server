import React, { useState, useEffect } from "react";

const FileList = WrappedComponent => {
  const [test, setTest] = useState();

  return props => {
    return <WrappedComponent {...props} />;
  };
};

export default FileList;
