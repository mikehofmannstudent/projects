function openExpenseModal(id) {
    const result = getExpense(id);

    if (!result.length) return;

    const expense = result[0].values[0];

    const date = new Date(expense[2]);

    document.getElementById("modalType").textContent = expense[1];
    document.getElementById("modalDate").textContent = date.toLocaleString();;
    document.getElementById("modalAmount").textContent = expense[3];
    document.getElementById("modalDescription").textContent = expense[4];
    document.getElementById("modalCategory").textContent = expense[5];
    document.getElementById("modalNotes").textContent = expense[6];

    const modal = document.getElementById("expenseModal");
    modal.classList.remove("hidden");
    modal.classList.add("flex");
}