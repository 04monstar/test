import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:9000');

const App = () => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [room, setRoom] = useState('');
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const pcRef = useRef(null); 

  useEffect(() => {
    // Get user media for local video stream
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        localVideoRef.current.srcObject = stream;
      })
      .catch((error) => {
        console.error('Error accessing media devices:', error);
      });
  
    // Initialize RTCPeerConnection
    createPeerConnection();
  
    // Event listeners for signaling messages
    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('ice-candidate', handleIceCandidate);
  
    // Event listener for chat messages
    socket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });
  
    // Alert when user is connected to a room
    socket.on('user connected', (roomName) => {
      alert(`You are now connected to room ${roomName}`);
    });
  
    return () => {
      socket.off('offer', handleOffer);
      socket.off('answer', handleAnswer);
      socket.off('ice-candidate', handleIceCandidate);
      socket.off('chat message');
      socket.off('user connected');
    };
  }, []);

  const handleOffer = (offer) => {
    // Handle offer from remote peer
    // Create peer connection if not already created
    if (!pcRef.current) {
      createPeerConnection();
    }

    // Handle offer
    const pc = pcRef.current;
    pc.setRemoteDescription(new RTCSessionDescription(offer))
      .then(() => pc.createAnswer())
      .then((answer) => {
        pc.setLocalDescription(answer);
        // Send answer to remote peer
        socket.emit('answer', answer);
      })
      .catch((error) => {
        console.error('Error creating answer:', error);
      });
  };

  const handleAnswer = (answer) => {
    // Handle answer from remote peer
    if (!pcRef.current) {
      console.error('RTCPeerConnection not initialized');
      return;
    }

    const pc = pcRef.current;
    pc.setRemoteDescription(new RTCSessionDescription(answer))
      .catch((error) => {
        console.error('Error setting remote description:', error);
      });
  };

  const handleIceCandidate = (candidate) => {
    // Handle ICE candidate from remote peer
    if (!pcRef.current) {
      console.error('RTCPeerConnection not initialized');
      return;
    }

    const pc = pcRef.current;
    pc.addIceCandidate(new RTCIceCandidate(candidate))
      .catch((error) => {
        console.error('Error adding ICE candidate:', error);
      });
  };

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [
        {
          urls: ['stun:stun.l.google.com:19302', 'stun:stun.l.google.com:19302'],
        },
      ],
    });
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        // Send ICE candidate to remote peer
        socket.emit('ice-candidate', event.candidate);
      }
    };
    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
      remoteVideoRef.current.srcObject = event.streams[0];
    };
    pcRef.current = pc;
  };

  const joinRoom = () => {
    // Join a room
    socket.emit('join room', room);
  };

  const sendMessage = () => {
    // Send chat message to server
    socket.emit('chat message', inputMessage);
    setInputMessage('');
  };

  const startCall = () => {
    // Start call by sending offer to server
    if (!pcRef.current) {
      console.error('RTCPeerConnection not initialized');
      return;
    }

    const pc = pcRef.current;
    localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
    pc.createOffer()
      .then((offer) => {
        pc.setLocalDescription(offer);
        // Send offer to server
        socket.emit('offer', offer);
      })
      .catch((error) => {
        console.error('Error creating offer:', error);
      });
  };

  return (
    <div>
      <div>
        <h2>Local Video</h2>
        <video ref={localVideoRef} autoPlay playsInline muted />
      </div>
      <div>
        <h2>Remote Video</h2>
        <video ref={remoteVideoRef} autoPlay playsInline />
      </div>
      <div>
        <h2>Chat</h2>
        <div>
          {messages.map((msg, index) => (
            <div key={index}>{msg}</div>
          ))}
        </div>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <input
        type="text"
        placeholder="Enter Room Name"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
      />
      <button onClick={joinRoom}>Join Room</button>
      <button onClick={startCall}>Start Call</button>
    </div>
  );
};

export default App;
