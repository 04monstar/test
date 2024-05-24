import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';

const CodeEditor = ({ roomId }) => {
    const [code, setCode] = useState('');
    const socketRef = useRef(null);
    const codeEditorRef = useRef(null);

    const handleReceiveCode = useCallback((newCode) => {
        if (newCode !== codeEditorRef.current.getValue()) {
            setCode(newCode);
            codeEditorRef.current.setValue(newCode);
        }
    }, []);

    useEffect(() => {
        // Initialize socket connection
        socketRef.current = io('http://localhost:9001');

        // Join the specified room
        socketRef.current.emit('join-room', roomId);

        // Initialize CodeMirror instance
        codeEditorRef.current = CodeMirror(document.getElementById('code-editor'), {
            value: code,
            mode: 'javascript',
            lineNumbers: true,
            theme: 'default',
        });

        // Emit code updates to the server
        codeEditorRef.current.on('change', (instance) => {
            const newCode = instance.getValue();
            if (newCode !== code) {
                socketRef.current.emit('code-update', { roomId, newCode });
            }
        });

        // Update code editor with received code
        socketRef.current.on('receive-code', handleReceiveCode);

        return () => {
            // Clean up socket connection and event listeners
            socketRef.current.off('receive-code', handleReceiveCode);
            socketRef.current.disconnect();
        };
    }, [roomId, handleReceiveCode, code]);

    return <div id="code-editor"></div>;
};

export default CodeEditor;
