import React from 'react';
import './App.css';

import Terminal from './Terminal';

function App() {
  return (
    <div className="xeno">
      <header className="xeno-header">
        XenoTerminal v0.0.2
      </header>
      <Terminal />
    </div>
  );
}

export default App;
