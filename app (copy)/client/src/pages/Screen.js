// src/SocketClient.js
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './Screen.css'; // Import CSS file

const SocketClient = () => {
  const [socket, setSocket] = useState(null);
  const [me, setMe] = useState(null); // To store user's own socket ID
  const [stream, setStream] = useState(null); // To store user's media stream
  const myVideoRef = useRef(); // Reference to user's video element
  const userVideoRef = useRef(); // Reference to remote user's video element
  const [callAccepted, setCallAccepted] = useState(false); // To track if call is accepted
  const [caller, setCaller] = useState(null); // To store information of the caller

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:5000'); // Replace with your server URL
    setSocket(newSocket);

    // Get user media
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        myVideoRef.current.srcObject = stream;
      })
      .catch((error) => console.error('Error accessing media devices:', error));

    // Listen for 'me' event to get own socket ID
    newSocket.on('me', (id) => {
      setMe(id);
    });

    // Listen for incoming call
    newSocket.on('calluser', ({ from, signal, name }) => {
      setCaller({ from, name });
    });

    return () => {
      newSocket.close();
      stream && stream.getTracks().forEach(track => track.stop()); // Stop media tracks
    };
  }, []);

  const callUser = (userId) => {
    // Call a user
    socket.emit('calluser', { userTOCall: userId, signalData: 'your_signal_data', from: me, name: 'Your Name' });
  };

  const answerCall = () => {
    // Answer a call
    setCallAccepted(true);
    // Implement your logic to accept the call and handle the signal
    // Example:
    socket.emit('answercall', { to: caller.from, signal: 'your_signal_data' });
  };

  return (
    <div className="video-container">
      <div className="video">
        <h1>Your Video</h1>
        <video ref={myVideoRef} autoPlay muted></video>
      </div>
      {callAccepted && (
        <div className="video">
          <h1>Caller's Video</h1>
          <video ref={userVideoRef} autoPlay></video>
        </div>
      )}
      {!callAccepted && caller && (
        <div className="caller-info">
          <h2>{caller.name} is calling...</h2>
          <button onClick={answerCall}>Answer</button>
        </div>
      )}
    </div>
  );
};

export default SocketClient;
