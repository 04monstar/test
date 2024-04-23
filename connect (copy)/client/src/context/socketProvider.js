import React, { createContext, useMemo, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return socket;
};

export const SocketProvider = (props) => {
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const newSocket = io("localhost:8000");
      setSocket(newSocket);
    } catch (error) {
      setError("Error connecting to the server.");
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!socket) {
    return <div>Connecting to server...</div>;
  }

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};
