import React, { useState, useContext, useEffect, createContext } from 'react';
import { io } from 'socket.io-client';

const socketContext = createContext(null);

export const useSocket = () => {
  const socket = useContext(socketContext);
  if (!socket) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return socket;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const connectSocket = async () => {
      try {
        const newSocket = io('http://localhost:2002');
        setSocket(newSocket);
      } catch (err) {
        setError(err.message);
        alert('Failed to connect to server. Please check your network connection.');
      }
    };

    connectSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  return (
    <socketContext.Provider value={socket}>
      {children}
    </socketContext.Provider>
  );
};
