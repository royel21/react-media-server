import React from "react";

const LoginRedirect = ({ Auth }) => {
  // if (!Auth) window.location.href = "/";
  console.log("not found");
  return (
    <div id="notfound">
      <h2>Unauthorized Zone</h2>
      <p>
        Are you lost? you are trying to access a private zone. if this is an error nothing will
        happend if this is your first time, but if there is a second time, we will take formal
        action against such individuals.
      </p>
      <div>
        <a id="return" href="/admin/">
          Return
        </a>
      </div>
    </div>
  );
};

export default LoginRedirect;
