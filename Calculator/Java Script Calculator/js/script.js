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
                throw Error("❌ Invalid Opertator");
            } else if (checkFloat(tokens[i]) || "-(".includes(tokens[i])) {
                lastTokenType = tokens[i];
            } else {
                throw Error("❌ Invalid Charater");
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
                throw Error("❌ Invalid Opertator");
            } else if (lastTokenType === "-" && tokens[i] === "-") {
                lastTokenType = "+";
            } else if (lastTokenType === "*" && tokens[i] === "*") {
                lastTokenType = "/";
            } else if (checkFloat(tokens[i]) || tokens[i] === "(") {
                lastTokenType = tokens[i];
            } else {
                throw Error("❌ Invalid Charater");
            }
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
    let lastChar = "";
    let numTokens = [];
    for (let i = 0; i < tokens.length; i++) {
        if (checkFloat(tokens[i]) || tokens[i] === ".") {
            if (lastChar === "*") {
                numTokens.push(lastChar);
                lastChar = tokens[i];
            } else if (tokens[i-1] === ")") {
                numTokens.push("*");
                lastChar = tokens[i];
            } else {
                lastChar += tokens[i];
            }
        } else if (["+", "/", ")"].includes(tokens[i])) {
            if (checkFloat(lastChar)) {
                numTokens.push(parseFloat(lastChar));
                lastChar = "";
            }
            numTokens.push(tokens[i]);
        } else if (["-", "*"].includes(tokens[i])) {
            if (checkFloat(lastChar)) {
                numTokens.push(parseFloat(lastChar));
                lastChar = tokens[i];
            } else if (lastChar === "-") {
                numTokens.push("+");
                lastChar = "";
            } else if (lastChar === "*") {
                numTokens.push("^");
                lastChar = "";
            }
        } else if (tokens[i] === "(") {
            if (checkFloat(lastChar)) {
                numTokens.push(parseFloat(lastChar), "*", tokens[i]);
                lastChar = "";
            } else if (tokens[i-1] === ")") {
                numTokens.push("*");
                numTokens.push(tokens[i]);
            } else {
                numTokens.push(tokens[i]);
            }
        }
    }

    if (checkFloat(lastChar)) {
        numTokens.push(parseFloat(lastChar));
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
        output += char + " ";
    });
    return output.slice(0, -1);
}

//---------------------
// Main Action
//---------------------

document.addEventListener("DOMContentLoaded", () => {
    const inputElement = document.getElementById("input");
    const calcElement = document.getElementById("calc");
    const resultElement = document.getElementById("result");
    let currentTokens = ""
    inputElement.addEventListener("keydown", (event) => {
        try {
            if (event.key === "Enter") {
                let tokens = tokenize(inputElement.value);
                currentTokens = textOutput(tokens);
                tokens = checkValid(tokens);
                tokens = numerify(tokens);

                inputElement.value = "";
                calcElement.textContent = textOutput(tokens);
                resultElement.textContent = "Result: " + fullCalculation(tokens);
            }
        } catch (error) {
            inputElement.value = "";
            calcElement.textContent = currentTokens;
            resultElement.textContent = error;
        }
    });
});

