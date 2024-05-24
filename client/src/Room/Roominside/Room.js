import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useSocket } from '../../hooks/Socket';
import { IoChatbubblesOutline } from "react-icons/io5";
import { VscVscodeInsiders } from "react-icons/vsc";
import { AiOutlineCamera, AiOutlineAudio, AiOutlineSound } from 'react-icons/ai';
import './Chat.css';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/hint/javascript-hint';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/display/autorefresh';

const ChatBox = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [showCode, setShowCode] = useState(false);
  const [jsCode, setJsCode] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('material');
  const [outputs, setOutputs] = useState([]);
  const [error, setError] = useState('');

  const { roomId, username } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const pcRef = useRef();

  const themes = [
    'material', '3024-day', '3024-night', 'abcdef', 'ambiance', 'ayu-dark', 'ayu-mirage', 'base16-dark', 'base16-light', 
    'bespin', 'blackboard', 'cobalt', 'colorforth', 'darcula', 'dracula', 'duotone-dark', 'duotone-light', 'eclipse', 
    'elegant', 'erlang-dark', 'gruvbox-dark', 'hopscotch', 'icecoder', 'idea', 'isotope', 'lesser-dark', 'liquibyte', 
    'lucario', 'material-darker', 'material-palenight', 'material-ocean', 'mbo', 'mdn-like', 'midnight', 'monokai', 
    'moxer', 'neat', 'neo', 'night', 'nord', 'oceanic-next', 'panda-syntax', 'paraiso-dark', 'paraiso-light', 
    'pastel-on-dark', 'railscasts', 'rubyblue', 'seti', 'shadowfox', 'solarized', 'the-matrix', 'tomorrow-night-bright', 
    'tomorrow-night-eighties', 'ttcn', 'twilight', 'vibrant-ink', 'xq-dark', 'xq-light', 'yeti', 'yonce', 'zenburn'
  ];

  const sendMessage = useCallback((e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (message.trim() !== '') {
        socket.emit('sendMessage', { roomId, message, username });
        setMessage('');
        toast.success('Message sent successfully');
      } else {
        toast.error('Please enter a message');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Error sending message');
    } finally {
      setLoading(false);
    }
  }, [roomId, message, username, socket]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage(event);
    }
  };

  const handleOffer = (offer) => {
    try {
      if (!pcRef.current) {
        createPeerConnection();
      }
      const pc = pcRef.current;
      pc.setRemoteDescription(new RTCSessionDescription(offer))
        .then(() => pc.createAnswer())
        .then((answer) => {
          pc.setLocalDescription(answer);
          socket.emit('answer', answer);
        })
        .catch((error) => {
          console.error('Error creating answer:', error);
          toast.error('Error creating answer');
        });
    } catch (error) {
      console.error('Error handling offer:', error);
      toast.error('Error handling offer');
    }
  };

  const handleAnswer = (answer) => {
    try {
      if (!pcRef.current) {
        console.error('RTCPeerConnection not initialized');
        return;
      }
      const pc = pcRef.current;
      if (pc.signalingState !== 'have-local-offer' && pc.signalingState !== 'have-remote-offer') {
        console.error('Cannot set remote answer in state other than "have-local-offer" or "have-remote-offer"');
        return;
      }
      const answerDescription = new RTCSessionDescription(answer);
      pc.setRemoteDescription(answerDescription)
        .then(() => {
          console.log('Remote description set successfully');
        })
        .catch((error) => {
          console.error('Error setting remote description:', error);
          toast.error('Error setting remote description');
        });
    } catch (error) {
      console.error('Error handling answer:', error);
      toast.error('Error handling answer');
    }
  };

  const handleIceCandidate = (candidate) => {
    try {
      if (!pcRef.current) {
        console.error('RTCPeerConnection not initialized');
        return;
      }
      const pc = pcRef.current;
      pc.addIceCandidate(new RTCIceCandidate(candidate))
        .catch((error) => {
          console.error('Error adding ICE candidate:', error);
          toast.error('Error adding ICE candidate');
        });
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
      toast.error('Error handling ICE candidate');
    }
  };

  const createPeerConnection = () => {
    try {
      const pc = new RTCPeerConnection({
        iceServers: [
          {
            urls: ['stun:stun.l.google.com:19302', 'stun:stun.l.google.com:19302'],
          },
        ],
      });
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', event.candidate);
        }
      };
      pc.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };
      if (localStream) {
        localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
      }
      pcRef.current = pc;
    } catch (error) {
      console.error('Error creating RTCPeerConnection:', error);
      toast.error('Error creating RTCPeerConnection');
    }
  };

  const startCall = () => {
    setLoading(true);
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        createPeerConnection();
        pcRef.current.createOffer()
          .then((offer) => {
            pcRef.current.setLocalDescription(offer);
            socket.emit('offer', offer);
            setLoading(false);
          })
          .catch((error) => {
            console.error('Error creating offer:', error);
            toast.error('Error creating offer');
            setLoading(false);
          });
      })
      .catch((error) => {
        console.error('Error accessing media devices:', error);
        toast.error('Error accessing media devices');
        setLoading(false);
      });
  };

  const leaveRoom = () => {
    try {
      socket.emit("leaveRoom", roomId);
      toast.success("Left the room successfully");
      navigate('/enterRoom');
    } catch (error) {
      console.error("Error leaving room:", error);
      toast.error("An error occurred while leaving the room");
    }
  };

  const toggleCamera = () => {
    try {
      setIsCameraOn(prevState => {
        if (localStream && localStream.getVideoTracks().length > 0) {
          localStream.getVideoTracks()[0].enabled = !prevState;
        }
        return !prevState;
      });
    } catch (error) {
      console.error('Error toggling camera:', error);
      toast.error('Error toggling camera');
    }
  };

  const toggleMicrophone = () => {
    try {
      setIsMicrophoneOn(prevState => {
        if (localStream && localStream.getAudioTracks().length > 0) {
          localStream.getAudioTracks()[0].enabled = !prevState;
        }
        return !prevState;
      });
    } catch (error) {
      console.error('Error toggling microphone:', error);
      toast.error('Error toggling microphone');
    }
  };

  const toggleSpeaker = () => {
    try {
      setIsSpeakerOn(prevState => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.muted = !prevState;
        }
        return !prevState;
      });
    } catch (error) {
      console.error('Error toggling speaker:', error);
      toast.error('Error toggling speaker');
    }
  };

  const executeJsCode = (jsCode) => {
    setError('');
    try {
      const originalConsoleLog = console.log;
      const consoleMessages = [];
      console.log = (message) => {
        consoleMessages.push(message);
      };
      const execute = new Function(jsCode);
      execute();
      setOutputs(consoleMessages);
      console.log = originalConsoleLog;
    } catch (error) {
      setError('Error during execution: ' + error.message);
    }
  };

  useEffect(() => {
    if (!socket) return;
    socket.emit('joinRoom', { roomId, participants: username });
    socket.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('ice-candidate', handleIceCandidate);
    return () => {
      socket.off('message');
      socket.off('offer', handleOffer);
      socket.off('answer', handleAnswer);
      socket.off('ice-candidate', handleIceCandidate);
      if (pcRef.current) {
        pcRef.current.close();
      }
    };
  }, [socket, roomId, username]);

  return (
    <div className="chat-box">
  <div className="toggle-btn-container">
    <button className="chat-btn" onClick={() => setShowChat(!showChat)}><IoChatbubblesOutline className="chat-icon" /></button>
    <button className="code-btn" onClick={() => setShowCode(!showCode)}><VscVscodeInsiders className="code-icon" /></button>
  </div>
  {showChat && (
    <div className="chat-container">
      <div className="chat-messages-container">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className="message">
              <p className="message-text"><strong className="username">{msg.user}:</strong> {msg.text}</p>
            </div>
          ))}
        </div>
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="chat-input"
        />
        <button className="send-btn" onClick={sendMessage}>Send</button>
      </div>
    </div>
  )}
  {showCode && (
    <div className="code-container">
      <div className="editor-container">
        <h1 className="editor-title">JavaScript Code Editor</h1>
        <CodeMirror
          value={jsCode}
          className={`codemirror-wrapper`}
          options={{
            mode: 'javascript',
            lineNumbers: true,
            theme: selectedTheme,
            autoCloseBrackets:true,
            hintOptions:true,
            extraKeys: { "Ctrl-Space": "autocomplete" },
          }}
          onBeforeChange={(editor, data, value) => {
            setJsCode(value);
          }}
         
        />
        <div className="theme-select-container">
          <label htmlFor="themeSelect" className="theme-label">Select Theme: </label>
          <select id="themeSelect" value={selectedTheme} onChange={(e) => setSelectedTheme(e.target.value)} className="theme-select">
            {themes.map((theme) => (
              <option key={theme} value={theme} className="theme-option">{theme}</option>
            ))}
          </select>
        </div>
        <button className="execute-btn" onClick={() => executeJsCode(jsCode)}>Execute</button>
        {error && <div style={{ color: 'red' }} className="error-message">{error}</div>}
      </div>
      <div className="output-container">
        <h2 className="output-title">Output:</h2>
        <div className="output-list">
          {outputs.map((output, index) => (
            <li key={index} className="output-item">{output}</li>
          ))}
        </div>
      </div>
    </div>
  )}
  <div className="leave-btn-container">
    <button onClick={leaveRoom} className="leave-btn">Leave Room</button>
  </div>
  <div className="video-container">
    <div className="video-controls-container">
      <div className="local-video-container">
        <video ref={localVideoRef} autoPlay muted className="local-video"></video>
        <button onClick={toggleCamera} className="camera-btn">
          {isCameraOn ? <AiOutlineCamera className="camera-icon" /> : <AiOutlineCamera className="camera-icon" style={{ color: 'red' }} />}
        </button>
      </div>
      <div className="remote-video-container">
        <video ref={remoteVideoRef} autoPlay className="remote-video"></video>
        <button onClick={toggleMicrophone} className="microphone-btn">
          {isMicrophoneOn ? <AiOutlineAudio className="microphone-icon" /> : <AiOutlineAudio className="microphone-icon" style={{ color: 'red' }} />}
        </button>
        <button onClick={toggleSpeaker} className="speaker-btn">
          {isSpeakerOn ? <AiOutlineSound className="speaker-icon" /> : <AiOutlineSound className="speaker-icon" style={{ color: 'red' }} />}
        </button>
      </div>
    </div>
    <button onClick={startCall} disabled={loading} className="start-call-btn">
      {loading ? 'Connecting...' : 'Start Call'}
    </button>
  </div>
</div>
  );
};

export default ChatBox;
