// === STATE ===
let currentInput = "0";
let previousInput = [];
let currentAnswer = null;
let lastAnswer = null;
let errorMessage = null;
let postfix = [];
let operatorStack = [];

const operators = ["+", "-", "×", "÷"];

const previousDisplay = document.getElementById("previousDisplay");
const currentDisplay = document.getElementById("currentDisplay");
const ansDisplay = document.getElementById("ansDisplay");

function updateDisplay() {
    // Display error message over anything
    if (errorMessage) {
        currentDisplay.textContent = errorMessage;
        return;
    }

    // Update last answer
    if (lastAnswer) {
        ansDisplay.textContent = `ANS: ${lastAnswer}`;
    }

    // Display result
    if (currentAnswer) {
        currentDisplay.textContent = currentAnswer;
        return;
    }

    let displayValue = previousInput.join(" ") + " " + currentInput;

    currentDisplay.textContent = displayValue;

    const container = currentDisplay.parentElement;
    if (container) {
        // Find the scrollable container
        let scrollContainer = container;
        while (scrollContainer && !scrollContainer.classList.contains('display-scroll')) {
            scrollContainer = scrollContainer.parentElement;
        }
        if (scrollContainer) {
            scrollContainer.scrollLeft = scrollContainer.scrollWidth;
        }
    }
}

function appendNumber(number) {
    // Remove error message and result
    errorMessage = null;
    currentAnswer = null;

    // Prevent multiple decimal points
    if (number === "." && currentInput.includes(".")) {
        return;
    }

    // Prevent starting number with decimal point
    if (currentInput === "" && number === "."){
        return;
    }

    // Enter first number, preventing leading zeros
    if (currentInput === "0" && number !== ".") {
        currentInput = number;
    }

    // Prevent multiple leading zeros
    else if (number === "0" && currentInput === "0") {
        return;
    }

    // Append number
    else {
        currentInput += number;
    }

    // Update the display
    updateDisplay();
}

function appendOperator(operator) {
    const precedence = { "+": 1, "-": 1, "×": 2, "÷": 2 };

    // Operator after answer
    if (currentAnswer) {
        currentInput = currentAnswer;
        currentAnswer = null;
    }

    // Add operator after closed parenthesis
    if (previousInput[previousInput.length - 1] === ")") {
        operatorStack.push(operator);

        previousInput.push(operator);
        updateDisplay();
    }

    // Prevent mutiple operators
    if (currentInput === "") {
        return;
    }

    // Add number to postifix
    postfix.push(currentInput);

    // Move operator from stack to postfix
    while (operatorStack && precedence[operatorStack[operatorStack.length - 1]] >= precedence[operator]) {
        postfix.push(operatorStack.pop());
    }

    operatorStack.push(operator);

    // Clear current input and update display
    previousInput.push(currentInput, operator);
    console.log(previousInput);
    currentInput = "";
    updateDisplay();
}

function appendParenthesis(paren) {
    // Remove error message and result
    errorMessage = null;
    currentAnswer = null;

    // Handle opening parenthesis
    if (paren === "(") {
        // Multiplication with a number or parentesis
        if ((currentInput !== "" && previousInput[previousInput.length - 1] !== "(")
            || previousInput[previousInput.length - 1] === ")") {

            // Move all operators to postfix on parenthesis 
            if (previousInput[previousInput.length - 1] === ")") {
                while (operatorStack.length > 0) {
                    let op = operatorStack.pop();

                    if (op === "(") {
                        break;
                    }
                    
                    postfix.push(op); 
                }
            }
            // Move number to postfix
            else {
                postfix.push(currentInput);
            }

            operatorStack.push("×");
            previousInput.push(currentInput);
            currentInput = "";
        }

        operatorStack.push("(");
        previousInput.push("(");
    }
    // Handle closing parenthesis
    else if (paren === ")") {
        // Assure opening parethesis
        if (!operatorStack.includes("(")) {
            return;
        }

        // Prevent closing right after opening parenthesis
        if (currentInput === "" && previousInput[previousInput.length - 1] === "(") {
            return;
        }

        // Prevent closing brackets after operator
        if (currentInput === "" && operators.includes(previousInput[previousInput.length - 1])) {
            return;
        }

        // Add current number to postfix
        if (currentInput !== "") {
            postfix.push(currentInput);
        }

        // Move operators to postfix
        while (operatorStack.length > 0) {
            let op = operatorStack.pop();

            if (op === "(") {
                break;
            }
            
            postfix.push(op); 
        }

        previousInput.push(currentInput, ")");
        currentInput = "";
    }
    
    updateDisplay();
}

function appendANS() {
    // Remove error message and result
    errorMessage = null;
    currentAnswer = null;

    // Handle no previous answers
    if (lastAnswer === null) {
        return;
    }

    // Remove error message
    errorMessage = null;

    currentInput = lastAnswer;

    updateDisplay();
}

function handleError(message) {
    errorMessage = message;
    currentInput = "";
    previousInput = [];
}

function formatNumber(num) {
    const str = num.toString();
    const decimalIndex = str.indexOf('.');
    
    // If no decimal, return as is
    if (decimalIndex === -1) return num.toString();
    
    // Count decimal places
    const decimalPlaces = str.length - decimalIndex - 1;
    
    // Only use toFixed if 4 or more decimal places
    if (decimalPlaces >= 4) {
        return num.toFixed(4); // Or whatever precision you want
    }
    
    return str;
}

function calculate() {
    
    // Finalize postfix
    if (currentInput !== "") {
        previousInput.push(currentInput);
        postfix.push(currentInput);
        currentInput = "";
    }

    while (operatorStack.length > 0) {
        postfix.push(operatorStack.pop()); 
    }

    // Prevent ending with an operator
    if (operators.includes(previousInput[previousInput.length - 1])) {
        handleError("Invalid ending");
        updateDisplay();
        return;
    }

    // Prevent ending with an open parenthesis
    if (postfix.includes("(") || postfix.includes(")")){
        handleError("Invalid parenthesis");
        updateDisplay;
        return;
    }

    // Display 0 when nothing is shown
    if (currentInput === "0" || currentInput === "" && previousInput.length === 0) {
        currentAnswer = null;
        currentInput = "0";
        previousInput = [];
        postfix = [];
        updateDisplay();
        return;
    }

    // Calculate 
    let evalStack = [];

    if (postfix.length === 1) {
        evalStack.push(parseFloat(postfix.pop()));
    }
    
    while (postfix.length > 0) {
        token = postfix.shift();
        // Add numbers to eval stack
        if (!isNaN(token)) {
            evalStack.push(parseFloat(token));
        }
        // Evaluate numbers
        else if (operators.includes(token)) {
            const right = evalStack.pop();
            const left = evalStack.pop();

            let result;
            switch (token) {
                case "+": result = left + right; break;
                case "-": result = left - right; break;
                case "×": result = left * right; break;
                case "÷": result = left / right; break;
            }

            evalStack.push(formatNumber(result));
        }
    }

    currentAnswer = evalStack[0].toString();
    lastAnswer = evalStack[0].toString();
    
    currentInput = "";
    previousInput = [];
    updateDisplay();
}