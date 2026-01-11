# Define Different Operation Functions 
def add(num1, num2):
    return num1 + num2

def subtract(num1, num2):
    return num1 - num2

def multiply(num1, num2):
    return num1 * num2

def divide(num1, num2):
    if num2 == 0:
        raise ZeroDivisionError("> Cannot divide by 0")
    return num1 / num2

# Define Input Functions
def get_number(prompt):
    while True:
        try:
            num1 = float(input(prompt))
            return num1
        except ValueError:
            print("> That was not a number.")

def get_choice():
    while True:
        try:
            choice = int(input("What operation will you choose:\n"
                            "(1) add\n"
                            "(2) subtract\n"
                            "(3) multiply\n"
                            "(4) divide\n"
                            "> Choice: "
            ))
            if choice not in (1, 2, 3, 4):
                raise ValueError("> Choice must be between 1 and 4")
            return choice
        except ValueError as err:
            print(err)
            print_separator()

# Define Calculation Function
def calculate(num1, choice, num2):
    if choice == 1:
        return add(num1, num2)
    elif choice == 2:
        return subtract(num1, num2)
    elif choice == 3:
        return multiply(num1, num2)
    elif choice == 4:
        try:
            return divide(num1, num2)
        except ZeroDivisionError as err:
            print(err)
            return None
        except Exception as err:
            print("Unexpected error:", err)
            return None


# Define Output Function
def print_result(result):
    if result is not None:
        if result % 1 == 0:
            print("> Result:", int(result))
        else:
            print(f"> Result: {result:.2f}")

# Define Seperator Function
def print_separator():
    print("\n" + "-"*30 + "\n")

# Main Program
print("\nWelcome to the calculator!")
while True:
    # Get User Input
    print_separator()
    num1 = get_number("Enter first number: ")
    print_separator()
    choice = get_choice()
    print_separator()
    num2 = get_number("Enter second number: ")

    # Calculation
    result = calculate(num1, choice, num2)

    # Output Result
    print_separator()
    print_result(result)

    again = input("\nWould you like to use the calculator again? (Y/n)")
    if again.lower() == 'n':
        print("\nGoodbye!")
        break