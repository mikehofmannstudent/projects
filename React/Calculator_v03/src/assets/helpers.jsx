// --- Helper Functions ---

export function validateTokens(tokens) {
    const checkBrackets = (tokens) => {
        balance = 0;

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

    const OPERATORS = "+-*/";

    if (!tokens) {
        throw new Error("Empty equation");
    }
    if (OPERATORS.includes(tokens[0])) {
        throw new Error("Cannot start with an operator");
    }
    if (OPERATORS.includes(tokens[-1])) {
        throw new Error("Cannot end with an operator");
    }
    if (!checkBrackets(tokens)) {
        throw new Error("Invalid bracket use");
    }

    VALID_CHARS = "1234567890+-*/";

    for (let t of tokens) {
        if (!VALID_CHARS.include(t)) {
            throw new Error(`Not acceptable character ${t}`);
        }
    }
}

export function numrify(tokens) {
    const NUMBERS =( "1234567890");
    const OPERATORS = "+-*/()";
    let numrifyTokens = [];
    let number = "";
    for (let t of tokens) {
        if (NUMBERS.includes(t)) {
            number += t;
        } else if (OPERATORS.includes(t)) {
            if (number != "") {
                numrifyTokens.push(parseFloat(number))
                number = "";
            }
            numrifyTokens.push(t);
        }
    }
    
    if (number != "") {
        numrifyTokens.push(parseFloat(number));
    }

    return numrifyTokens;
}

export function executeOperation(op, op1, op2) {
    if (op === "+") {
        return op1 + op2;
    } else if (op === "-") {
        return op1 - op2;
    } else if (op === "*") {
        return op1 * op2;
    } else if (op === "/") {
        if (op2 === 0) {
            throw new Error("Cannot divide by 0");
        }
        return op1 / op2;
    } else {
        throw new Error(`Unknown operator "${op}"`);
    }
}

export function precedenceOf(theOp) {
    if (["+", "-"].includes(theOp)) {
        return 1;
    } else if (["*", "/"].includes(theOp)) {
        return 2;
    }
    return 0;
}

