let currentInput = "0";
let previousInput = [];
let currentAnswer = null;
let lastAnswer = null;
let errorMessage = null;
let parenBalance = 0;

const operators = ["+", "-", "×", "÷"];
const precedence = { "+": 1, "-": 1, "×": 2, "÷": 2 };

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
    if (lastAnswer !== null) {
        ansDisplay.textContent = `ANS: ${lastAnswer}`;
    }

    // Display result
    if (currentAnswer !== null) {
        currentInput = currentAnswer;
        currentDisplay.textContent = currentInput;
        currentAnswer = null;
        return;
    }

    let displayValue = "";
    if (previousInput.length > 0) {
        displayValue = previousInput.join(" ") + " " + currentInput;
    }
    else {
        displayValue = currentInput;
    }

    currentDisplay.textContent = displayValue;

    // Scrolling mechanic
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

    // Prevent multiple decimal points
    if (number === "." && currentInput.includes(".")) {
        return;
    }

    // Prevent starting number with decimal point
    if (currentInput === "" && number === "."){
        return;
    }

    // Prevent number after closing parenthesis
    if (previousInput[previousInput.length - 1] === ")") {
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
    // Add operator after closed parenthesis
    if (previousInput[previousInput.length - 1] === ")") {
        // operatorStack.push(operator);
        previousInput.push(operator);
        updateDisplay();
        return;
    }

    // Prevent mutiple operators
    if (currentInput === "") {
        return;
    }

    // Clear current input and update display
    previousInput.push(currentInput, operator);
    currentInput = "";
    updateDisplay();
}

function appendParenthesis(paren) {
    const previousToken = previousInput[previousInput.length - 1];
    console.log(previousInput.length)
    
    // Remove error message and result
    errorMessage = null;

    // Handle opening parenthesis
    if (paren === "(") {
        // Multiplication with a number 
        if (
            (!isNaN(currentInput) ||
            (!isNaN(currentInput) && previousToken !== "(")) &&
            (currentInput !== "0" || previousInput.length > 0)
        ) {
            previousInput.push(currentInput);
        }

        // Update previous input
        currentInput = "";
        previousInput.push("(");
        parenBalance++;
    }
    // Handle closing parenthesis
    else if (paren === ")") {
        // Assure opening parethesis
        if (parenBalance === 0) {
            return;
        }

        // Prevent closing right after opening parenthesis
        if (currentInput === "" && previousToken === "(") {
            return;
        }

        // Prevent closing brackets after operator
        if (
            currentInput === "" &&
            operators.includes(previousToken)
        ) {
            return;
        }

        previousInput.push(currentInput, ")");
        currentInput = "";
        parenBalance--;
    }
    
    updateDisplay();
}

function appendANS() {
    // Remove error message and result
    errorMessage = null;

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
    console.log(currentAnswer)
    // Display 0 
    if (
        previousInput.length === 0
    ) {
        lastAnswer = currentInput;
        currentInput = "0";
        updateDisplay();
        return;
    }

    // Generate postfix
    let postfix = [];
    let operatorStack = [];

    // Add remaining numbers to previous input
    if (currentInput !== "") {
        previousInput.push(currentInput);
    }

    // Prevent ending with an operator
    if (operators.includes(previousInput[previousInput.length - 1])) {
        handleError("Invalid ending");
        updateDisplay();
        return;
    }

    let i = 0;

    // Loop through previous input
    while (i < previousInput.length) {
        let token = previousInput[i];

        // Handle numbers
        if (!isNaN(token)) {
            postfix.push(token);
        }
        // Handle operators
        else if (operators.includes(token)) {
            if (
                operatorStack.length !== 0 && 
                precedence[operatorStack[operatorStack.length - 1]] >= precedence[token]
            ) {
                postfix.push(operatorStack.pop());
            }

            operatorStack.push(token);
        }
        // Handle opening parenthesis
        else if (token === "(") {
            // Move all operators to postfix on parenthesis 
            if (previousInput[i - 1] === ")") {
                while (operatorStack.length > 0) {
                    let op = operatorStack.pop();

                    if (op === "(") {
                        break;
                    }
                    
                    postfix.push(op); 
                }
            }

            if (
                !isNaN(previousInput[i - 1]) ||
                previousInput[i - 1] === ")"
            ) {
                operatorStack.push("×");
            }

            operatorStack.push("(");
        }
        // Handle closing parenthesis
        else if (token === ")") {
            // Move operators to postfix
            while (operatorStack.length > 0) {
                let op = operatorStack.pop();

                if (op === "(") {
                    break;
                }
                
                postfix.push(op); 
            }
        }

        i++;
        console.log(postfix)
    }
    
    // Add remaining operators to postfix
    while (operatorStack.length > 0) {
        postfix.push(operatorStack.pop())
    }
    console.log(postfix)

    // Calculate 
    let evalStack = [];

    if (postfix.length === 1) {
        evalStack.push(parseFloat(postfix.pop()));
    }
    
    while (postfix.length > 0) {
        const token = postfix.shift();
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
                case "÷": 
                    if (right === 0) {
                        handleError("No zero division");
                        updateDisplay();
                        return;
                    }
                    result = left / right; 
                    break;
            }

            evalStack.push(parseFloat(formatNumber(result)));
        }
    }

    currentAnswer = evalStack[0].toString();
    lastAnswer = evalStack[0].toString();
    
    currentInput = "";
    previousInput = [];
    updateDisplay();
    console.log(currentAnswer)
}

function deleteLast() {
    const deleteToken = previousInput[previousInput.length - 1]

    // Remove error message
    if (errorMessage !== null) {
        errorMessage = null;
        currentInput = "0";
        updateDisplay();
        return;
    }
    
    // Prevent deleting initial zero
    if (currentInput === "0" && previousInput.length === 0) {
        return;
    }

    // Delete newest number
    if (currentInput !== "") {
        // Starting number will always be 0
        if (previousInput.length === 0 && currentInput.length === 1) {
            currentInput = "0";
        }
        // Remove one character from number
        else if (currentInput !== "") {
            let digits = [];
            digits = currentInput.split("");
            digits.pop();
            currentInput = digits.join("");
        }
    }

    // Delete operator
    else if (operators.includes(deleteToken) && currentInput === "") {
        previousInput.pop();
        currentInput = previousInput.pop();
    }

    // Delete parenthesis
    else if ((deleteToken === ")" || deleteToken === "(") && currentInput === "") {
        previousInput.pop();

        // Remove number multplication with parenthesis
        if (!isNaN(previousInput[previousInput.length - 12])) {
            currentInput = previousInput.pop();
        }
    }

    updateDisplay();
}

function clearAll() {
    // Remove error message
    if (errorMessage !== null) {
        errorMessage = null;
        currentInput = "0";
        updateDisplay();
        return;
    }

    // Clear previous and current input
    previousInput = [];
    currentInput = "0";
    updateDisplay();
}

// Handle keystrokes
document.addEventListener("keydown", (event) => {
    const key = event.key;

    // Numbers and decimal points
    if (key >= "0" && key <= "9" || key === ".") {
        appendNumber(key);
        return;
    }

    // Operators
    if (operators.includes(key)) {
        if (key === "/") {
            event.preventDefault();
        }
        appendOperator(key);
        return;
    }

    // Parenthesis
    if (["(", ")"].includes(key)) {
        appendParenthesis(key);
        return;
    }

    // Enter or =
    if (["Enter", "="].includes(key)) {
        event.preventDefault();
        calculate();
        return;
    }

    // Backspace
    if (key === "Backspace") {
        event.preventDefault();
        deleteLast();
        return;
    }

    // Clear all
    if (key === "Escape") {
        clearAll();
        return;
    }

    // A for ANS
    if (key === "a") {
        appendANS();
    }
});