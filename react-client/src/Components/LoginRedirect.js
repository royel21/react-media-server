import React from "react";

const LoginRedirect = ({ Auth }) => {
  if (!Auth) window.location.href = "/login";
  return <div></div>;
};

export default LoginRedirect;
