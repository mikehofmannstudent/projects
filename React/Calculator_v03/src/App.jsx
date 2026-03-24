import { useState } from 'react'
import { validateTokens, numrify, executeOperation } from './assets/helpers';

function App() {
  const [text, setText] = useState("");

  
  const parseInfixToPostfix = (equation) => {
    // --- Tokenize ---
    const tokens = [...equation.replace(/\s+/g, "")];

    // --- Validate ---
    try {
      validateTokens(tokens);
    } catch (err) {
      setText(err.message);
    }

    // --- Numrify ---
    const numrifyTokens = numrify(tokens)

    // --- Infix to Postfix Conversion ---
    let opStack = []
    let postfixQueue = []

    for (let t of numrifyTokens) {
      if (["+", "-", "*", "/"].includes(t)) {
        
      }
    }
  }

  const textSetTest = () => {
    try {
      const result = executeOperation("/", 1, 0);
      setText(result);
    } catch (err) {
      setText(err.message);
    }
  }


  

  return (
    <div>
      <input 
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></input>

      <button onClick={textSetTest}>Test</button>
    </div>
  )
}

export default App
