document.addEventListener("DOMContentLoaded", () => {
    const inputElement = document.getElementById("input");
    const outputElement = document.getElementById("output");
    const addButtonElement = document.getElementById("addButton");

    // Load todos from localStorage
    let todos = JSON.parse(localStorage.getItem("todos")) || [];

    // Render all todos
    function renderTodos() {
        outputElement.innerHTML = "";

        todos.forEach((todo, index) => {
            const line = document.createElement("div");

            // Create checkbox
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";

            // Store checked state
            checkbox.checked = todo.completed || false;

            checkbox.addEventListener("change", () => {
                todos[index].completed = checkbox.checked;
                saveTodos();
            });

            // Create text
            const text = document.createElement("span");
            text.textContent = todo.text;

            // Delete button
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "✖";

            deleteBtn.addEventListener("click", () => {
                todos.splice(index, 1);
                saveTodos();
                renderTodos();
            });

            line.appendChild(checkbox);
            line.appendChild(text);
            line.appendChild(deleteBtn);

            outputElement.appendChild(line);
        });
    }

    // Save todos to localStorage
    function saveTodos() {
        localStorage.setItem("todos", JSON.stringify(todos));
    }

    // Add a new todo
    function addTodo() {
        const value = inputElement.value.trim();
        if (value === "") return;

        todos.unshift({
            text: value,
            completed: false
        });

        saveTodos();
        renderTodos();
        inputElement.value = "";
    }

    // Enter key adds todo
    inputElement.addEventListener("keydown", (event) => {
        if (event.key === "Enter") addTodo();
    });

    // Button click adds todo
    addButtonElement.addEventListener("click", addTodo);

    // Initial render
    renderTodos();
});
