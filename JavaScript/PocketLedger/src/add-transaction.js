const buttons = document.querySelectorAll(".toggle-btn");

buttons.forEach(button => {
    button.addEventListener("click", () => {
        buttons.forEach(btn =>
            btn.classList.remove("toggle-btn-active")
        );

        button.classList.add("toggle-btn-active");
    });
});

flatpickr("#date", {
    dateFormat: "d/m/Y",
    defaultDate: "today",
    allowInput: true
});

const category = document.getElementById("category");
const container = document.getElementById("newCategoryContainer");
const input = document.getElementById("newCategoryInput");

category.addEventListener("change", () => {
    if (category.value === "other") {
        container.classList.remove("hidden");
        input.focus();
    } else {
        container.classList.add("hidden");
    }
});

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();

        const value = input.value.trim();
        if (!value) return;

        // Create a new option
        const option = new Option(value, value);

        // Add it after "Create new category"
        category.insertBefore(option, category.lastElementChild);

        // Select the new option
        category.value = value;

        // Hide and clear the input
        input.value = "";
        container.classList.add("hidden");
    }
});