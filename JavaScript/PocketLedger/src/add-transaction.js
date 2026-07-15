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

const form = document.getElementById("entryForm");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    saveEntry();
});

function getEntryType() {
    return document
        .querySelector(".toggle-btn-active")
        .textContent
        .includes("Credit")
            ? "Credit"
            : "Debit";
}

function validateInput() {
    const date = document.getElementById("date").value.trim();
    const amount = document.getElementById("amount").value.trim();
    const description = document.getElementById("description").value.trim();
    const category = document.getElementById("category").value;
    const newCategory = document.getElementById("newCategoryInput").value.trim();

    if (!date) {
        alert("Please select a date.");
        return false;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
        alert("Please enter a valid amount greater than 0.");
        return false;
    }

    if (!description) {
        alert("Please enter a description.");
        return false;
    }

    if (!category) {
        alert("Please select a category.");
        return false;
    }

    if (category === "other" && !newCategory) {
        alert("Please enter a new category.");
        return false;
    }

    return true;
}

function saveEntry() {
    if (!validateInput()) {
        return;
    }

    const type = getEntryType();

    const date = document.getElementById("date").value;
    const [day, month, year] = date.split("/");
    const today = new Date();

    today.setFullYear(Number(year));
    today.setMonth(Number(month) - 1);
    today.setDate(Number(day));

    const dateTime = today.toISOString();
    
    const amount = parseFloat(document.getElementById("amount").value);

    const description = document.getElementById("description").value.trim();

    let category = document.getElementById("category").value;
    console.log(category )
    if (category === "other") {
        category = document.getElementById("newCategoryInput").value
    }

    const notes = document.getElementById("notes").value.trim();

    addExpense(type, dateTime, amount, description, category, notes);

    window.location.href = "transactions.html";
}

function loadCategories() {
    const container = document.getElementById("category");

    container.innerHTML = `<option value="other">Create new category</option>`

    const results = getCategories();

    if (results.length) {
        results[0].values.forEach(([category]) => {
            container.innerHTML += `
                <option>${category}</option>
            `
        });
    }
}

function attachDeleteEvents() {
    document.querySelectorAll(".delete-category").forEach(button => {

        button.addEventListener("click", () => {
            const category = button.dataset.category;

            if (!confirm(
                `Delete "${category}"?\n\nAll transactions in this category will also be deleted.`
            )) return;

            if (!confirm(
                "This action cannot be undone."
            )) return;

            deleteCategory(category);

            loadDelCategories();
            loadCategories();
        });
    });
}

function loadDelCategories() {
    const container = document.getElementById("categoryList");

    container.innerHTML = "";

    const results = getCategories();

    if (!results.length) return;

    results[0].values.forEach(([category]) => {

        container.innerHTML += `
            <div class="flex justify-between items-center border rounded-lg px-3 py-2">

                <span>${category}</span>

                <button
                    class="delete-category btn-secondary text-red-600"
                    data-category="${category}">
                    Delete
                </button>

            </div>
        `;
    });

    attachDeleteEvents();
}

const modal = document.getElementById("categoryModal");

document.getElementById("manageCategoriesBtn").addEventListener("click", () => {
    loadDelCategories();
    modal.classList.remove("hidden");
});

document.getElementById("closeCategoryModal").addEventListener("click", () => {
    modal.classList.add("hidden");
});

const entry = document.getElementById("saveEntry");

entry.addEventListener("click", () => {

});


function loadNewEntryPage() {
    loadCategories()

    loadDelCategories();
}

async function main() {
    await initDatabase();
    
    loadNewEntryPage();
}

main();