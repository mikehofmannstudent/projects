const today = new Date();
const ago30Days = new Date(today);

ago30Days.setDate(today.getDate() - 30);
const ago30Day = ago30Days.getDate();
const currentDay = today.getDate();
const currentMonth = today.getMonth() + 1;
const currentYear = today.getFullYear();
const currentQuarterNum = Math.floor(currentMonth / 3) + 1;

const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

function handleTable(option) {
    let html = "";
    let results = [];

    const currentBalance = totalAmount("Credit")[0].values[0][0] - totalAmount("Debit")[0].values[0][0]
                           - upcomingAmount("Credit")[0].values[0][0] + upcomingAmount("Debit")[0].values[0][0];
    let runningBalance = currentBalance;

    let yearMonthDay = "";

    switch (option) {
        case "display30Day":
            yearMonthDay = currentMonth === 1
                ? `${currentYear}-12-${String(ago30Day).padStart(2, "0")}`
                : `${currentYear}-${String(currentMonth - 1).padStart(2, "0")}-${String(ago30Day).padStart(2, "0")}`;

            results = getOccurredExpensesAfterDate("date", "DESC", "1000", yearMonthDay);

            break;

        case "displayQuarter":
            const firstMonth = (currentQuarterNum - 1) * 3 + 1;
            yearMonthDay = `${currentYear}-${String(firstMonth).padStart(2, "0")}-01`;

            results = getOccurredExpensesAfterDate("date", "DESC", "1000", yearMonthDay);
            break;

        case "displayYear":
            yearMonthDay = `${currentYear}-01-01`

            results = getOccurredExpensesAfterDate("date", "DESC", "1000", yearMonthDay);
            break;

        case "displayAll":
            results = getOccurredExpenses("date", "DESC", "1000");
            break;
    }

    if (!results[0]) {
        return "";
    }

    results[0].values.forEach(expense => {
        const [year, month, day] = expense[2].split("-");
        const formattedDate = `${monthNames[Number(month) - 1]} ${Number(day)} ${year}`

        const category = expense[1] === "Credit" ? "credit" : "debit";
        const credit = expense[1] === "Credit" ? expense[3] : "—";
        const debit = expense[1] === "Debit" ? expense[3] : "—";

        const balanceForRow = runningBalance.toFixed(2);

        html += `
            <tr data-id="${expense[0]}" class="border-b border-[var(--color-sage-line)] hover:bg-[var(--color-sage)]/40 transition-colors">
                <td class="px-5 lg:px-6 h-11 pl-[3.75rem] whitespace-nowrap text-[var(--color-ink-soft)]">${formattedDate}</td>
                <td class="px-3 font-medium">${expense[4]}</td>
                <td class="px-3"><span class="inline-block px-2 py-0.5 rounded text-xs bg-[var(--color-credit-light)] text-[var(--color-${category})]">${expense[1]}</span></td>
                <td class="px-3 text-right font-mono tabular text-[var(--color-debit)]">${debit}</td>
                <td class="px-3 text-right font-mono tabular text-[var(--color-credit)]">${credit}</td>
                <td class="px-5 lg:px-6 text-right font-mono tabular">${balanceForRow}</td>
            </tr>
        `;

        runningBalance = expense[1] === "Credit" ? runningBalance - expense[3] : runningBalance + expense[3];
    });

    return html;
}

function loadTableFooter(option) {
    const footer = document.getElementById("ledgerTableFooter");

    let count = 0;
    let totalCount = 0;
    let startDate = "";
    let endDate = "";

    const dateToday = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(currentDay).padStart(2, "0")}`;

    switch (option) {
        case "display30Day":
            startDate = currentMonth === 1
                ? `${currentYear}-12-${String(ago30Day).padStart(2, "0")}`
                : `${currentYear}-${String(currentMonth - 1).padStart(2, "0")}-${String(ago30Day).padStart(2, "0")}`;
            endDate = dateToday;
            break;

        case "displayQuarter":
            const firstMonth = (currentQuarterNum - 1) * 3 + 1;

            startDate = `${currentYear}-${String(firstMonth).padStart(2, "0")}-01`;
            endDate = dateToday;
            break;

        case "displayYear":
            startDate = `${currentYear}-01-01`;
            endDate = dateToday;
            break;

        case "displayAll":
            const firstEntry = getOccurredExpenses("date", "DESC", "1");
            const lastEntry = getOccurredExpenses("date", "ASC", "1");

            startDate = lastEntry[0].values[0][2];
            endDate = firstEntry[0].values[0][2];
            break;
    }

    totalCount = countEntries(startDate, endDate)[0].values[0][0];
    count = totalCount > 1000 ? 1000 : totalCount;
    
    footer.textContent = `Showing ${count} of ${totalCount} entries`
}

function refreshTable(period, ledger) {
    switch (period.value) {
        case "last30days":
            ledger.innerHTML = handleTable("display30Day");
            loadTableFooter("display30Day");
            break;

        case "thisQuarter":
            ledger.innerHTML = handleTable("displayQuarter");
            loadTableFooter("displayQuarter");
            break;
        
        case "thisYear":
            ledger.innerHTML = handleTable("displayYear");
            loadTableFooter("displayYear");
            break;

        case "allTime":
            ledger.innerHTML = handleTable("displayAll");
            loadTableFooter("displayAll");
            break;
    }
}

function openExpenseModal(id) {
    const result = getExpense(id);

    if (!result.length) return;

    const expense = result[0].values[0];

    document.getElementById("modalType").textContent = expense[1];
    document.getElementById("modalDate").textContent = expense[2];
    document.getElementById("modalAmount").textContent = expense[3];
    document.getElementById("modalDescription").textContent = expense[4];
    document.getElementById("modalCategory").textContent = expense[5];
    document.getElementById("modalNotes").textContent = expense[6];

    const modal = document.getElementById("expenseModal");
    modal.classList.remove("hidden");
    modal.classList.add("flex");
}

function loadReportPage() {
    const period = document.getElementById("displayPeriod")
    
    // Load 30 day ledger table
    const ledger = document.getElementById("ledgerTable");
    ledger.innerHTML = handleTable("display30Day");

    // Load ledger table footer
    loadTableFooter("display30Day");

    // Watch for period changes
    period.addEventListener("change", () => {
        refreshTable(period, ledger);
    });

    // Load modal
    let selectedExpenseId = null;

    const modal = document.getElementById("expenseModal");
    
    document.getElementById("closeModal").onclick = () => {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
    };

    modal.onclick = (e) => {
        if (e.target === modal) {
            selectedExpenseId = null;

            modal.classList.add("hidden");
            modal.classList.remove("flex");
        }
    };

    document.getElementById("ledgerTable").addEventListener("click", (e) => {
        const row = e.target.closest("tr");

        if (!row) return;

        selectedExpenseId = row.dataset.id;
        openExpenseModal(row.dataset.id);
    });

    document.getElementById("deleteExpense").onclick = () => {
        if (selectedExpenseId === null) return;

        if (!confirm("Delete this transaction?")) return;

        deleteExpense(selectedExpenseId);

        document.getElementById("expenseModal").classList.add("hidden");
        document.getElementById("expenseModal").classList.remove("flex");

        refreshTable(period, ledger);
    };
}

async function main() {
    await initDatabase();

    loadReportPage();
}

main();