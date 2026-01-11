import subprocess

def gum_input(prompt, placeholder=""):
    proc = subprocess.Popen(
        ["gum", "input", "--prompt", prompt, "--placeholder", placeholder],
        stdout=subprocess.PIPE,
        text=True
    )
    return proc.communicate()[0].strip()

def gum_confirm(prompt):
    return subprocess.run(
        ["gum", "confirm", prompt]
    ).returncode == 0

def gum_style(text):
    return subprocess.run(["gum", "style", "--border", "rounded", "--padding", "1", text])

def gum_error(prompt):
    return subprocess.run([
        "gum", "style",
        "--foreground", "196",
        "--bold",
        prompt
    ])

# Define Float Checker
def check_float(num):
    try:
        float(num)
        return True
    except ValueError:
        return False

# Define Brackers Checker
def check_brackets(list):
    open_brackets = 0
    closed_brackets = 0
    first_bracket = True
    for item in list:
        if item == '(':
            break
        elif item == ')':
            first_bracket = False
            break
    for item in list:
        if item == '(':
            open_brackets += 1
        elif item == ')':
            closed_brackets += 1
    if first_bracket == True and open_brackets == closed_brackets:
        return True
    else:
        return False

# Define Input Function
def get_input():
    raw = gum_input(
        "Enter calculation: ",
        "e.g. (2+3)*4"
    ).replace(" ", "")
    userin = raw
    token = []
    last_type = ''
    current_number = ''
    try:
        for char in userin:
            # Add Number To Current Number
            if char.isdigit():
                if current_number == '(':
                    current_number = char
                elif current_number == '-':
                    current_number += char
                elif current_number == '*':
                    token.append(current_number)
                    current_number = char 
                else:
                    current_number += char
                last_type = 'number'
            # Add . To Current Number
            elif char == '.':
                current_number += char
                last_type = 'number'
            # Add Close Brackets
            elif check_float(current_number) and char == ')':
                token.append(float(current_number))
                current_number = char
                token.append(char)
            # Add Open Brackets
            elif char == '(':
                # If Open Bracket At Start
                if current_number == '':
                    current_number = char
                # If Number Before Open Bracket  
                elif check_float(current_number):
                    token.extend([float(current_number), '*'])
                    current_number = ''
                # If Close Bracket Before Open Bracket
                elif current_number == ')':
                    token.append('*')
                    current_number = ''
                # If '-' Before Open Bracket
                elif current_number == '-':
                    del token[-1]
                    token.append(current_number)
                    current_number = ''
                token.append(char)
                last_type = 'operator'
            elif current_number == ')':
                if char.isdigit():
                    token.extend([current_number, '*'])
                    current_number = char
                if char == ')':
                    token.append(current_number)
                    last_type = 'operator'
            elif char in '+-*/':
                # Add Number to Token + Add Symbol to Token
                if current_number:
                    # If Bracket Before Symbol
                    if current_number in '()':
                        token.append(char)
                        current_number = ''
                    # If Number Before '-'
                    elif check_float(current_number) and char == '-':
                        token.extend([float(current_number), '+'])
                        current_number = char
                    # If '-' Before '-'
                    elif current_number == '-' and char == '-':
                        current_number = ''
                    # If Number Before '*'
                    elif check_float(current_number) and char == '*':
                        token.append(float(current_number))
                        current_number = char
                    # If '*' Before '*'
                    elif current_number == '*' and char == '*':
                        token.append('^')
                        current_number = ''
                    else:
                        token.append(float(current_number))
                        token.append(char)
                        current_number = ''
                    last_type = 'operator'
                # Add Negative at Start of Current Number
                elif last_type == '' and current_number == '' and char == '-':
                    current_number += char
                    last_type = 'operator'
                else:
                    gum_error(f"> {raw}\n❌ Invalid Operation")
                    raise ValueError
            else:
                gum_error(f"> {raw}\n❌ Unknown Charater")
                raise ValueError
        if check_brackets(token):
            if current_number == ')':
                return raw, token
            elif current_number and last_type == 'number':
                token.append(float(current_number))
                return raw, token
            else:
                gum_error(f"> {raw}\n❌ Invalid Operation: Cannot End on a Symbol")
                raise ValueError
        else:
            gum_error(f"> {raw}\n❌ Improper Bracket Usage")
            raise ValueError
    except ValueError as err:
        gum_error(f"{err}")
        return None, None


# Define Calculation Function
def calculate(token):
    multiplied = []
    squared = []
    skip = False
    for i in range(len(token)):
        if skip:
            skip = False
            continue
        elif token[i] == '^':
            placeholder = squared.pop(-1)
            squared.append(placeholder**token[i+1])
            skip = True
        else:
            squared.append(token[i])
            
    for i in range(len(squared)):
        if skip:
            skip = False
            continue
        elif squared[i] == '*':
            placeholder = multiplied.pop(-1)
            multiplied.append(placeholder * squared[i+1])
            skip = True
        elif squared[i] == '/':
            try:
                placeholder = multiplied.pop(-1)
                multiplied.append(placeholder / squared[i+1])
                skip = True
            except ZeroDivisionError:
                gum_error(f"{raw}\n❌ Cannot divide by 0")
                return None
        else:
            multiplied.append(squared[i])
    
    result = multiplied[0]
    for i in range(1, len(multiplied)):
        if skip:
            skip = False
            continue
        elif multiplied[i] == '+':
            result += multiplied[i+1]
            skip = True
        elif multiplied[i] == '-':
            result -= multiplied[i+1]
            skip = True
    return result

# Define Brackets Calculation Function
def calculate_brackets(open_index, closed_index, token):
    calc = token[open_index+1:closed_index]
    return calculate(calc)

# Define Brackets Calculation Function
def full_calculation(token):
    # Find Index Of Bracket Opening and Ending
    while '(' in token:
        open_i = max(i for i, t in enumerate(token) if t == '(')
        close_i =  next(i for i in range(open_i, len(token)) if token[i] == ')')
        
        value = calculate(token[open_i+1:close_i])
        token = token[:open_i] + [value] + token[close_i+1:]
    return calculate(token)

# Define Output Function
def print_result(result):
    if result is not None:
        if result % 1 == 0:
            gum_style(f"✅ Result: {int(result)}")
        else:
            gum_style(f"✅ Result: {result:.2f}")

# Define Seperator Function
def print_separator():
    print("\n" + "-"*30 + "\n")

# Main Program
gum_style("🧮 Welcome to the Calculator")

while True:
    # Get User Input
    print_separator()
    raw, numbers = get_input()

    # Calculation
    if numbers is not None:
        result = full_calculation(numbers)
    else:
        continue

    # Output Result
    if result is not None:
        gum_style(f"🧮 Calculation: {raw}")
        print_result(result)
    else:
        continue
    
    if not gum_confirm("Would you like to use the calculator again?"):
        gum_style("👋 Goodbye!")
        break