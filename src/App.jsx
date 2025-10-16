import React, { useState, useEffect } from "react";
import Final from "./final";
import TerminalLoading from "./TerminalLoading";

function App() {
  const [showFinal, setShowFinal] = useState(false);

  return (
    <div className="App">
      {!showFinal ? (
        <TerminalLoading onFinish={() => setShowFinal(true)} />
      ) : (
        <Final />
      )}
    </div>
  );
}

export default App;
