import React, { useState, createContext } from "react";

export const SocketContext = createContext();

const SockectContextProvider = (props) => {
  const [socket] = useState(props.socket);

  window.addEventListener("beforeunload", (e) => {
    socket.close();
  });

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};

export default SockectContextProvider;
