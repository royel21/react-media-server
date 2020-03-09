import React, { useState, useEffect } from "react";

const FileList = WrappedComponent => props => {
  const [test, setTest] = useState();

  return <WrappedComponent {...props} />;
};

export default FileList;
