document.addEventListener("DOMContentLoaded", () => {
    const inputElement = document.getElementById("input");
    const outputElement = document.getElementById("output");
    const buttonElement = document.getElementById("button");

    // Load todos from localStorage
    let todos = JSON.parse(localStorage.getItem("todos")) || [];

    // Render all todos
    function renderTodos() {
        outputElement.innerHTML = "";
        todos.forEach(todo => {
            const line = document.createElement("div");
            line.textContent = todo;
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

        todos.push(value);
        saveTodos();
        renderTodos();

        inputElement.value = "";
    }

    // Enter key adds todo
    inputElement.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            addTodo();
        }
    });

    // Button click adds todo
    buttonElement.addEventListener("click", addTodo);

    // Initial render
    renderTodos();
});
