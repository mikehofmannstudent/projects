const today = new Date();

const currentMonth = today.getMonth();
const currentQuarterNum = Math.floor(currentMonth / 3) + 1;
const currentQuarter = `Q${Math.floor(currentMonth / 3) + 1}`;
const currentYear = today.getFullYear();

const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
const firstMonth = (currentQuarterNum - 1) * 3 + 1;
const quarterMonthsNum = [firstMonth, firstMonth + 1, firstMonth + 2];
const allMonthsNum = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

function loadPeriod() {
    const list = document.getElementById("period");

    list.innerHTML = `
        <option value="thisQuarter">This quarter — ${currentQuarter} ${currentYear}</option>
        <option value="thisYear">This year — ${currentYear}</option>
        <option value="lastYear">Last year — ${currentYear - 1}</option>
    `;
}

function handleChart(year, months, monthNames) {
    let html = "";
    let monthlyData = [];
    let max = 0;

    months.forEach(month => {
        const credit = amountInMonth("Credit", year, month)[0].values[0][0];
        const debit = amountInMonth("Debit", year, month)[0].values[0][0];
        
        monthlyData.push([credit, debit]);
    });

    monthlyData.forEach(month => {
        max = Math.max(max, month[0], month[1]);
    });

    months.forEach(month => {
        const credit = amountInMonth("Credit", year, month)[0].values[0][0];
        const debit = amountInMonth("Debit", year, month)[0].values[0][0];
        
        const creditHeight = max === 0 ? 0 : credit / max * 100;
        const debitHeight = max === 0 ? 0 : debit / max * 100;

        html += `
            <div class="flex-1 flex flex-col items-center gap-2">
                <div class="w-full flex items-end gap-1.5 h-40">
                    <div class="flex-1 bg-[var(--color-credit)] rounded-t" style="height: ${creditHeight}%"></div>
                    <div class="flex-1 bg-[var(--color-debit)] rounded-t" style="height: ${debitHeight}%"></div>
                </div>
                <span class="text-xs text-[var(--color-ink-soft)]">${monthNames[month - 1]}</span>
            </div>
        `;
    });

    return html;
}

function loadQuarterChart() {
    const chart = document.getElementById("reportChart");

    chart.innerHTML = handleChart(currentYear, quarterMonthsNum, monthNames);
}

function loadYearChart(year) {
    const chart = document.getElementById("reportChart");
    
    chart.innerHTML = handleChart(year, allMonthsNum, monthNames);
}

function handleCategorySummary(year, months) {
    let results = [];
    let totalExpense = 0;

    months.forEach(month => {
        const result = getMonthExpenses("Debit", year, month);

        if (result[0] !== undefined) {
            result[0].values.forEach(expense => {
                const category = expense[5];
                const amount = expense[3];

                results[category] ??= 0;
                results[category] += amount;

                totalExpense += amount;
            });
        }
    });

    const sorted = Object.entries(results).sort(([, a], [, b]) => b - a);

    let html = "";

    Object.entries(sorted).forEach(expense => {
        const barWidth = expense[1][1] / totalExpense * 100;

        html += `
            <li>
                <div class="flex justify-between text-sm mb-1.5">
                    <span>${expense[1][0]}</span>
                    <span class="font-mono tabular">SG$${expense[1][1]}</span>
                </div>
                <div class="h-2 rounded-full bg-[var(--color-sage)] overflow-hidden">
                    <div class="h-full bg-[var(--color-brand)] rounded-full" style="width: ${barWidth}%"></div>
                </div>
            </li>
        `;
    });

    return html;
}

function loadQuarterCategorySummary() {
    const expenses = document.getElementById("categoryExpensesSummary");
    
    if (handleCategorySummary(currentYear, allMonthsNum) === "") {
        expenses.innerHTML = `
            <li class="py-2.5 text-sm text-[var(--color-ink-soft)]">
                No past expenses.
            </li>
        `;

        return;
    }

    expenses.innerHTML = handleCategorySummary(currentYear, quarterMonthsNum);
}

function loadYearCategorySummary(year) {
    const expenses = document.getElementById("categoryExpensesSummary");
    
    if (handleCategorySummary(year, allMonthsNum) === "") {
        expenses.innerHTML = `
            <li class="py-2.5 text-sm text-[var(--color-ink-soft)]">
                No past expenses.
            </li>
        `;

        return;
    }

    expenses.innerHTML = handleCategorySummary(year, allMonthsNum);
}

function handleSummary(year, months) {
    let totalIncome = 0;
    let totalExpense = 0;

    months.forEach(month => {
        const creditResults = getMonthExpenses("Credit", year, month);
        const debitResults = getMonthExpenses("Debit", year, month);

        if (creditResults[0] !== undefined) {
            creditResults[0].values.forEach(income => {
                totalIncome += income[3];
            })
        }

        if (debitResults[0] !== undefined) {
            debitResults[0].values.forEach(expense => {
                totalExpense += expense[3];
            });
        }
    });

    const netProfit = totalIncome - totalExpense

    let html = `
        <div class="flex justify-between py-2 border-b border-[var(--color-paper-rule)]">
            <dt class="text-sm text-[var(--color-ink-soft)]">Total income</dt>
            <dd class="font-mono tabular text-sm text-[var(--color-credit)]">SG$${totalIncome}</dd>
        </div>
        <div class="flex justify-between py-2 border-b border-[var(--color-paper-rule)]">
            <dt class="text-sm text-[var(--color-ink-soft)]">Total expenses</dt>
            <dd class="font-mono tabular text-sm text-[var(--color-debit)]">SG$${totalExpense}</dd>
        </div>
        <div class="flex justify-between py-2 border-b border-[var(--color-paper-rule)]">
            <dt class="text-sm text-[var(--color-ink-soft)]">Net profit</dt>
            <dd class="font-mono tabular text-sm font-medium">SG$${netProfit.toFixed(2)}</dd>
        </div>
    `;
    
    return html;
}

function loadQuarterSummary() {
    const summary = document.getElementById("expensesSummary");

    summary.innerHTML = handleSummary(currentYear, quarterMonthsNum);
}

function loadYearSummary(year) {
    const summary = document.getElementById("expensesSummary");

    summary.innerHTML = handleSummary(year, allMonthsNum);
}

function loadReportPage() {
    // Load period
    loadPeriod();
    const period = document.getElementById("period");
    
    // Load report chart & category/expenses summary
    loadQuarterChart();
    loadQuarterCategorySummary();
    loadQuarterSummary();

    period.addEventListener("change", () => {
        switch (period.value) {

            case "thisQuarter":
                loadQuarterChart();
                loadQuarterCategorySummary();
                loadQuarterSummary();
                break;

            case "thisYear":
                loadYearChart(currentYear);
                loadYearCategorySummary(currentYear);
                loadYearSummary(currentYear);
                break;

            case "lastYear":
                loadYearChart(currentYear - 1);
                loadYearCategorySummary(currentYear - 1);
                loadYearSummary(currentYear - 1);
                break;
        }
    });    
}

async function main() {
    await initDatabase();
    
    loadReportPage();
}

main();