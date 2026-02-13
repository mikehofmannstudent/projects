import customtkinter as ctk
import tkinter as tk
from tkinter import font


# Create the main window
root = tk.Tk()
root.title("My First Tkinter App")
root.attributes('-fullscreen', True)
# Press Esc to exit fullscreen
def exit_fullscreen(event):
    root.attributes('-fullscreen', False)
    root.geometry('800x600')
root.bind('<Escape>', exit_fullscreen)

# Fonts
title_font = font.Font(root, family='Nunito', size=32, weight="bold")
textbox_font = ctk.CTkFont(family='Nunito', size=24)

# Homepage Frame
homepage_frame = tk.Frame(root, width=600)
homepage_frame.pack(fill='y', anchor='n')
homepage_frame.grid_columnconfigure(0, weight=1)
homepage_frame.grid_columnconfigure(1, weight=0)

title_label = tk.Label(homepage_frame, text="To-Do List", font=title_font, fg='#002347')
title_label.grid(row=0, column=0, pady=(100, 20))

todo_text = ctk.CTkTextbox(homepage_frame, 
                           font=textbox_font, 
                           text_color='#666666', 
                           fg_color='#CCCCCC',
                           width=400,
                           height=50)
todo_text.grid(row=1, column=0, sticky='w')

def expand_text(event=None):
    # Count the number of lines in the Text widget
    lines = int(todo_text.index('end-1c').split('.')[0])
    line_height = textbox_font.metrics('linespace')
    # Set min and max height in lines
    min_height  = line_height * 1
    max_height  = line_height * 5
    new_height = min(max(lines * line_height, min_height), max_height)
    todo_text.configure(height=new_height)

todo_text.bind("<KeyRelease>", expand_text)

submit_button = ctk.CTkButton(
    homepage_frame,
    text="Add",
    fg_color="#FD7702",
    hover_color="#FF5003",
    width=80,
    height=50,
    corner_radius=8
)
submit_button.grid(row=1, column=1)

def submit_task():
    text = todo_text.get("1.0", "end-1c")
    print(text)

submit_button.configure(command=submit_task)

# Run the main event loop
root.mainloop()