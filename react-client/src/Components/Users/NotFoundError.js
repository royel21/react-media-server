import React from "react";

const NotFoundError = () => {
  window.location.href = "/notfound";

  return <h2>Not Fount</h2>;
};

export default NotFoundError;
