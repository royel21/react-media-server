import React, { useState, createContext } from "react";
import socketIOClient from "socket.io-client";

export const SocketContext = createContext();

const SockectContextProvider = props => {
  const [socket] = useState(socketIOClient("/"));

  window.addEventListener("beforeunload", e => {
    socket.close();
    console.log("unloaded");
  });

  socket.on("connect_error", error => {
    console.log(error);
  });

  socket.on("disconnect", reason => {
    console.log(reason);
  });
  return <SocketContext.Provider value={socket}>{props.children}</SocketContext.Provider>;
};

export default SockectContextProvider;
