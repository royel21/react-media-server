import React, { useState, createContext } from "react";
import socketIOClient from "socket.io-client";

export const SocketContext = createContext();

const SockectContextProvider = props => {
  const [socket] = useState(socketIOClient("/"));

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};

export default SockectContextProvider;
