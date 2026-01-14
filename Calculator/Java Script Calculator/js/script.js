//---------------------
// Utility Functions
//---------------------

// Float Checker Function
function checkFloat(num) {
    return !isNaN(parseFloat(num));
}

// Brackets Checker Function
function checkBrackets(tokens) {
    let balance = 0;
    for (let t of tokens) {
        if (t === "(") {
            balance += 1;
        } else if (t === ")") {
            balance -= 1;
            if (balance < 0) {
                return false;
            }
        }
    }
    return balance === 0;
}

//---------------------
// Tokenizer
//---------------------

function tokenize (userin) {
    userin = userin.replace(/\s+/g, "");
    return userin.split("");
}

//---------------------
// Check Validity
//---------------------

function checkValid (tokens) {
    if (!checkBrackets(tokens)) {
        throw Error("Invalid Bracket Use");
    }

    let lastTokenType = "";
    for (let i = 0; i < tokens.length; i++) {
        if (lastTokenType === "") {
            if (["+", "*", "/"].includes(tokens[i])) {
                throw Error("❌ Invalid Operator");
            } else if (checkFloat(tokens[i]) || "-(".includes(tokens[i])) {
                lastTokenType = tokens[i];
            } else {
                throw Error("❌ Invalid Character");
            }
        } else if (checkFloat(lastTokenType)) {
            if (checkFloat(tokens[i]) || tokens[i] === ".") {
                lastTokenType += tokens[i];
            } else if (["+", "-", "*", "/"].includes(tokens[i])) {
                lastTokenType = tokens[i];
            } else if (["(", ")"].includes(tokens[i])) {
                lastTokenType = "";
            } else {
                throw Error("❌ Invalid Bracket Use");
            }
        } else if (["+", "-", "*", "/"].includes(lastTokenType)) {
            if (["+", "/"].includes(tokens[i])) {
                throw Error("❌ Invalid Operator");
            } else if (lastTokenType === "-" && tokens[i] === "-") {
                lastTokenType = "+";
            } else if (lastTokenType === "*" && tokens[i] === "*") {
                lastTokenType = "/";
            } else if (checkFloat(tokens[i]) || tokens[i] === "(") {
                lastTokenType = tokens[i];
            } else {
                throw Error("❌ Invalid Character");
            }
        } else if (tokens[i] === "(" && tokens[i+1] === ")") {
            throw Error("❌ Empty Parentheses");
        }
    } 

    if (["+", "-", "*", "/"].includes(lastTokenType)) {
        throw Error("❌ Cannot End With An Operator");
    }

    return tokens;
}

//---------------------
// Numerify
//---------------------

function numerify (tokens) {
    let currentNumber = "";
    let numTokens = [];
    let lastWasOperator = true;
    for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];

        if (checkFloat(t) || t === ".") {
            currentNumber += t;
            lastWasOperator = false;
        } else if (t === "-" && lastWasOperator) {
            currentNumber = "-";
            lastWasOperator = false;
        } else if (t === "*") {
            if (tokens[i-1] === "*") {
                numTokens.pop();
                numTokens.push("^");
            } else if (currentNumber !== "") {
                numTokens.push(parseFloat(currentNumber));
                numTokens.push(t);
                currentNumber = "";
            }
        } else if (["+", "-", "/", "^"].includes(t)) {
            if (currentNumber !== "") {
                numTokens.push(parseFloat(currentNumber));
                currentNumber = "";
            }
            numTokens.push(t);
            lastWasOperator = true;
        } else if (t === "(") {
            if (currentNumber !== "") {
                numTokens.push(parseFloat(currentNumber), "*");
                currentNumber = "";
            }
            numTokens.push(t);
            lastWasOperator = true;
        } else if (t === ")") {
            if (currentNumber !== "") {
                numTokens.push(parseFloat(currentNumber));
                currentNumber = "";
            }
            numTokens.push(t);
            lastWasOperator = false;
        } else {
            throw Error("❌ Invalid character: " + t);
        }

    }

    if (currentNumber !== "") {
        numTokens.push(parseFloat(currentNumber));
    }
    
    return numTokens;
}

//---------------------
// Calculate
//---------------------

function calculate (tokens) {
    let multiplied = [];
    let squared = [];
    let skip = false;
    for (let i = 0; i < tokens.length; i++) {
        if (skip) {
            skip = false;
            continue;
        } else if (tokens[i] === "^") {
            let placeholder = squared.pop()
            squared.push(placeholder**tokens[i+1])
            skip = true;
        } else {
            squared.push(tokens[i])
        }
    }

    for (let i = 0; i < squared.length; i++) {
        if (skip) {
            skip = false;
            continue;
        } else if (squared[i] === "*") {
            let placeholder = multiplied.pop();
            multiplied.push(placeholder * squared[i+1]);
            skip = true;
        } else if (squared[i] === "/") {
            if (squared[i+1] === 0) {
                throw Error("❌ Cannot divide by 0");
            } else {
                let placeholder = multiplied.pop();
                multiplied.push(placeholder / squared[i+1]);
                skip = true;
            }
        } else {
            multiplied.push(squared[i]);
        }
    }

    let result = multiplied[0];
    for (let i = 0; i < multiplied.length; i++) {
        if (skip) {
            skip = false;
            continue;
        } else if (multiplied[i] === "+") {
            result += multiplied[i+1];
            skip = true;
        } else if (multiplied[i] === "-") {
            result -= multiplied[i+1];
            skip = true;
        }
    }

    if (result % 1 === 0) {
        return parseInt(result);
    } else {
        return Math.round(result * 100) / 100
    }
}

function calcBrackets (openI, closedI, tokens) {
    return calculate(tokens.slice(openI+1, closedI))
}

function fullCalculation (tokens) {
    while (tokens.includes("(")) {
        const openI = tokens.lastIndexOf("(");
        const closedI = tokens.indexOf(")", openI);
        
        const inner = tokens.slice(openI+1, closedI);
        const value = calculate(inner);

        tokens.splice(openI, closedI-openI+1, value);
    }

    return calculate(tokens);
}

//---------------------
// Output
//---------------------

function textOutput (tokens) {
    let output = "";
    tokens.forEach(char => {
        output += char;
    });
    return output;
}

//---------------------
// Main Action
//---------------------

document.addEventListener("DOMContentLoaded", () => {
    // Calculator
    const inputElement = document.getElementById("input");
    const calcElement = document.getElementById("calc");
    const resultElement = document.getElementById("result");

    let currentTokens = ""
    inputElement.addEventListener("keydown", (event) => {
        try {
            if (event.key === "Enter") {
                const tokens = numerify(checkValid(tokenize(inputElement.value)));
                const result = fullCalculation(tokens);

                addHistory(textOutput(tokenize(inputElement.value)), result);
                
                calcElement.textContent = textOutput(tokenize(inputElement.value));
                resultElement.textContent = "Result: " + result
                inputElement.value = "";
            }
        } catch (error) {   
            calcElement.textContent = textOutput(tokenize(inputElement.value));
            resultElement.textContent = error;
            inputElement.value = "";
        }
    });
    
    // Toggle History
    const histButtonElement = document.getElementById("toggleHistory");
    const histBoxElement = document.getElementById("history");

    histButtonElement.addEventListener("click", () => {
        histBoxElement.classList.toggle("show");
        histButtonElement.classList.toggle("active");

        // if (histBoxElement.style.display === "none") {
        //     histBoxElement.style.display = "block";
        // } else {
        //     histBoxElement.style.display = "none";
        // }
    });

    // History List
    const historyElement = document.getElementById("histList");
    
    // Load History from Storage
    let historyList = JSON.parse(sessionStorage.getItem("historyList")) || [];

    function renderHistory () {
        historyElement.innerHTML = "";

        historyList.forEach((history, index) => {
            const line = document.createElement("div");
            line.textContent = history.expression + " = " + history.result;
            historyElement.appendChild(line);
        });
    }

    // Save History To localStorage
    function saveHistory() {
        sessionStorage.setItem("historyList", JSON.stringify(historyList));
    }
    
    // Add New History
    function addHistory(expression, result) {
        if (!expression) return;

        historyList.unshift({ expression, result });
        saveHistory();
        renderHistory();
    }
    
    // Initial render
    renderHistory();
});
