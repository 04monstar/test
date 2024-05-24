import React, { useState, useEffect } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/theme/eclipse.css';
import 'codemirror/theme/twilight.css';
import 'codemirror/theme/3024-day.css';
import 'codemirror/theme/3024-night.css';
import 'codemirror/mode/javascript/javascript';


function useJsCodeExecutor() {
  const [outputs, setOutputs] = useState([]);
  const [error, setError] = useState('');

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

  return { outputs, error, executeJsCode };
}

function CodeBox() {
  const [jsCode, setJsCode] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('material');
  const themes = ['material', 'dracula', 'monokai', 'eclipse', 'twilight', '3024-day', '3024-night'];

  const { outputs, error, executeJsCode } = useJsCodeExecutor();

  useEffect(() => {
    executeJsCode(jsCode);
  }, [jsCode]);

  const changeTheme = (event) => {
    setSelectedTheme(event.target.value);
  };

  return (
    <div className="app-container">
      <div className="editor-container">
        <h1>JavaScript Code Editor</h1>
        <br />
        <CodeMirror
          value={jsCode}
          className={`codemirror-wrapper`}
          options={{
            mode: 'javascript',
            lineNumbers: true,
            theme: selectedTheme,
            extraKeys: { "Ctrl-Space": "autocomplete" },
          }}
          onBeforeChange={(editor, data, value) => {
            setJsCode(value);
          }}
        />
        <br />
        <div>
          <label htmlFor="themeSelect">Select Theme: </label>
          <select id="themeSelect" value={selectedTheme} onChange={changeTheme}>
            {themes.map((theme) => (
              <option key={theme} value={theme}>{theme}</option>
            ))}
          </select>
        </div>
        <button onClick={() => executeJsCode(jsCode)}>Execute</button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </div>
      <div className="output-container">
        <h2>Output:</h2>
        <ul>
          {outputs.map((output, index) => (
            <li key={index}>{output}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CodeBox;
