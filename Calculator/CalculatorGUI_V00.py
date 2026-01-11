import customtkinter as ctk
import tkinter as tk
from tkinter import font

#====================
# Utility Functions
#====================

# Define Float Checker
def check_float(num):
    try:
        float(num)
        return True
    except ValueError:
        return False

# Define Brackers Checker
def check_brackets(tokens):
    balance = 0
    for t in tokens:
        if t == '(':
            balance += 1
        elif t == ')':
            balance -= 1
            if balance < 0:
                return False
    return balance == 0

#====================
# Tokenizer
#====================

# Define Input Function
def get_input(userin):
    token = []
    last_type = ''
    current_number = ''

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
            print(token)
            last_type = 'operator'
        elif current_number == ')':
            if char.isdigit():
                token.extend([current_number, '*'])
                current_number = char
            elif char == ')':
                token.append(current_number)
                last_type = 'operator'
        elif char in '+-*/':
            # Add Number to Token + Add Symbol to Token
            if current_number:
                # If Bracket Before Symbol
                if current_number in '()':
                    current_number = ''
                    token.append(char)
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
                # Add Number + Add Symbol
                else:
                    token.append(float(current_number))
                    current_number = ''
                    token.append(char)
                last_type = 'operator'
            # Add Negative at Start of Current Number
            elif current_number == '' and char == '-':
                current_number += char
                last_type = 'operator'
            else:
                raise ValueError("❌ Invalid Operation")
        else:
            raise ValueError("❌ Unknown Charater")
    if check_brackets(token):
        if current_number == ')':
            return token
        elif current_number and last_type == 'number':
            token.append(float(current_number))
            return token
        else:
            raise ValueError("❌ Invalid Operation: Cannot End on a Symbol")
    else:
        raise ValueError("❌ Improper Bracket Usage")

#====================
# Calculation Logic
#====================

# Define Calculation Function
def calculate(token):
    multiplied = []
    skip = False
    for i in range(len(token)):
        if skip:
            skip = False
            continue
        elif token[i] == '*':
            placeholder = multiplied.pop()
            multiplied.append(placeholder * token[i+1])
            skip = True
        elif token[i] == '/':
            if token[i+1] == 0:
                raise ZeroDivisionError("❌ Cannot divide by 0")
            else:
                placeholder = multiplied.pop()
                multiplied.append(placeholder / token[i+1])
                skip = True
        else:
            multiplied.append(token[i])
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
    if result % 1 == 0:
        return int(result)
    else:
        return round(result, 2)

# Define Brackets Calculation Function
def calculate_brackets(open_index, closed_index, token):
    calc = token[open_index+1:closed_index]
    return calculate(calc)

# Define Brackets Calculation Function
def full_calculation(token):
    while '(' in token:
        open_i = max(i for i, t in enumerate(token) if t == '(')
        close_i =  next(i for i in range(open_i, len(token)) if token[i] == ')')
        
        value = calculate(token[open_i+1:close_i])
        token = token[:open_i] + [value] + token[close_i+1:]
    return calculate(token)

#====================
# GUI Setup
#====================

# Main window
root = tk.Tk()
root.title("Calculator")
root.geometry("800x600")

frame = tk.Frame(root)
frame.pack(expand=True)

# Fonts
title_font = font.Font(root, family="Nunito", size=32, weight="bold")
text_font = ctk.CTkFont(family="Nunito", size=24)

# Title
title = tk.Label(frame, text="Welcome to the Calculator", font=title_font)
title.grid(row=0, column=0, pady=(60, 30))

# Input
entry = ctk.CTkEntry(frame, font=text_font, width=400)
entry.grid(row=1, column=0, pady=10)

# Result
result_label = tk.Label(frame, font=text_font)
result_label.grid(row=2, column=0, pady=20)

# ======================
# Event Handler
# ======================

def submit(event=None):
    expr = entry.get().replace(" ", "")
    entry.delete(0, "end")

    try:
        tokens = get_input(expr)
        result = full_calculation(tokens)
        result_label.config(text=f"Result: {result}")
    except Exception as e:
        result_label.config(text=str(e))


entry.bind("<Return>", submit)

root.mainloop()