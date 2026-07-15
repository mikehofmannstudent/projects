const currentDate = document.getElementById("currentDate");

const today = new Date();
const thisYear = today.getFullYear();
const thisMonth = today.getMonth() + 1;

const weekday = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

const options = {
    weekday: "long",
    month: "long",
    day: "numeric"
};

currentDate.textContent = `${today.toLocaleDateString(undefined, options)}`

function loadComparison() {
    const compareNetBalance = document.getElementById("compareNetBalance");

    const thisMonthBalance = amountInMonth("Credit", thisYear, thisMonth)[0].values[0][0] - amountInMonth("Debit", thisYear, thisMonth)[0].values[0][0];
    const lastMonthBalance = amountInMonth("Credit", thisYear, thisMonth - 1)[0].values[0][0] - amountInMonth("Debit", thisYear, thisMonth - 1)[0].values[0][0];

    let comparison = 0;
    
    if (lastMonthBalance !== 0) {
        comparison = ((thisMonthBalance - lastMonthBalance) / Math.abs(lastMonthBalance)) * 100;
    }

    compareNetBalance.textContent = `${comparison.toFixed(1)}% vs last month`;

    const arrow = document.getElementById("comparisonArrow");
    const comparisonText = document.getElementById("comparisonContainer");

    if (comparison > 0) {
        arrow.classList.remove("rotate-180");
        comparisonText.classList.remove("text-[var(--color-debit)]");
        comparisonText.classList.add("text-[var(--color-credit)]");
    }
    else if (comparison < 0) {
        arrow.classList.add("rotate-180");
        comparisonText.classList.remove("text-[var(--color-credit)]");
        comparisonText.classList.add("text-[var(--color-debit)]");
    }
    else {
        arrow.classList.remove("rotate-180");
        arrow.classList.add("rotate-90")
        comparisonText.classList.remove("text-[var(--color-credit)]");
        comparisonText.classList.remove("text-[var(--color-debit)]");
    }
}

function loadEntriesTable() {
    const table = document.getElementById("recentEntriesTable");

    const result = getOccurredExpenses("dateTime", "DESC", "5");

    if (result[0] === undefined) {
        table.innerHTML = "";
        return;
    }

    const rows = result[0].values;

    const currentBalance = totalAmount("Credit")[0].values[0][0] - totalAmount("Debit")[0].values[0][0]
                           - upcomingAmount("Credit")[0].values[0][0] + upcomingAmount("Debit")[0].values[0][0];
    let runningBalance = currentBalance;

    table.innerHTML = "";

    rows.forEach(row => {
        const [id, type, dateTime, amount, description, category, notes] = row;
        
        const balanceForRow = runningBalance.toFixed(2);
        
        const credit = type === "Credit" 
            ? amount.toFixed(2)
            : "—";
        
        const debit = type === "Debit"
            ? amount.toFixed(2)
            : "—";

        const date = new Date(dateTime);
        const entryDate = `${weekday[date.getDay()]}, ${date.getDate()} ${monthNames[date.getMonth()]}`

        table.innerHTML += `
            <tr data-id="${id}" class="border-b border-[var(--color-sage-line)] hover:bg-[var(--color-sage)]/40 transition-colors">
                <td class="px-5 lg:px-6 pt-1 h-11 pl-[3.75rem] whitespace-nowrap text-[var(--color-ink-soft)]">
                    ${entryDate}
                </td>

                <td class="px-3 pt-1 font-medium">
                    ${description}
                </td>

                <td class="px-3 pt-1 text-[var(--color-ink-soft)]">
                    ${category}
                </td>

                <td class="px-3 pt-1 text-right font-mono tabular text-[var(--color-debit)]">
                    ${debit}
                </td>

                <td class="px-3 pt-1 text-right font-mono tabular text-[var(--color-credit)]">
                    ${credit}
                </td>

                <td class="px-5 pt-1 lg:px-6 text-right font-mono tabular">
                    ${balanceForRow}
                </td>
            </tr>
        `;

        runningBalance = type === "Credit" ? runningBalance - amount : runningBalance + amount;
    });
}

function loadUpcomingList() {
    const upcomingList = document.getElementById("upcomingList");

    const result = getUpcomingExpenses("dateTime", "DESC", "5");

    if (result.length === 0) {
        upcomingList.innerHTML = `
            <li class="py-2.5 text-sm text-[var(--color-ink-soft)]">
                No upcoming transactions.
            </li>
        `;
        return;
    }

    const rows = result[0].values;

    let html = "";

    rows.forEach(row => {
        const [id, type, dateTime, amount, description, category, notes] = row;

        const date = new Date(dateTime);
        const entryDate = `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

        const color = type === "Credit"
            ? "text-[var(--color-credit)]"
            : "text-[var(--color-debit)]"

        html += `
            <li data-id="${id}" class="flex items-center justify-between py-2.5 border-b border-[var(--color-sage-line)] hover:bg-[var(--color-sage)]/40 transition-colors">
                <div>
                    <p class="text-sm font-medium">${description}</p>
                    <p class="text-xs text-[var(--color-ink-soft)]">${entryDate}</p>
                </div>
                <span class="font-mono tabular text-sm ${color}">SG$${amount}</span>
            </li>
        `;
    });

    upcomingList.innerHTML = html;
}

function loadModal() {
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

    document.getElementById("recentEntriesTable").addEventListener("click", (e) => {
        const row = e.target.closest("tr");

        if (!row) return;

        selectedExpenseId = row.dataset.id;
        openExpenseModal(row.dataset.id);
    });

    document.getElementById("upcomingList").addEventListener("click", (e) => {
        const row = e.target.closest("li");

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

        loadEntriesTable();
        loadUpcomingList();
    };
}

function loadDashboard() {
    // Load net balance
    const netBalance = document.getElementById("netBalance");
    const balance = totalAmount("Credit")[0].values[0][0] - totalAmount("Debit")[0].values[0][0] 
                    + upcomingAmount("Debit")[0].values[0][0] - upcomingAmount("Credit")[0].values[0][0];

    netBalance.textContent = `SG$${balance.toFixed(2)}`;
    
    // Load balance comparison vs last month
    loadComparison();

    // Load this month's credits 
    const thisMonthCredits = document.getElementById("thisMonthCredits");

    const creditsThisMonth = amountInMonth("Credit", thisYear, thisMonth)[0].values[0][0];

    thisMonthCredits.textContent = `SGS${creditsThisMonth.toFixed(2)}`;

    // Load this month's credit entries
    const creditEntries = document.getElementById("creditEntries");

    creditEntries.textContent = `${EntriesThisMonth("Credit")[0].values[0][0]} entries posted`;

    // Load this month's debits
    const thisMonthDebits = document.getElementById("thisMonthDebits");

    const debitsThisMonth = amountInMonth("Debit", thisYear, thisMonth)[0].values[0][0];

    thisMonthDebits.textContent = `SG$${debitsThisMonth.toFixed(2)}`

    // Load this month's debit entries
    const debitEntries = document.getElementById("debitEntries");

    debitEntries.textContent = `${EntriesThisMonth("Debit")[0].values[0][0]} entries posted`;

    // Load 5 most recent entries
    loadEntriesTable();

    // Load upcoming list
    loadUpcomingList();

    // Load modal
    loadModal();
}


async function main() {
    await initDatabase();
    
    loadDashboard();
}

main();