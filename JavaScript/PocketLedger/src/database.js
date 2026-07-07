let db;

async function initDatabase() {
    const SQL = await initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`
    });

    const saved = localStorage.getItem("ledgerDB");

    if (saved) {
        const bytes = new Uint8Array(JSON.parse(saved));
        db = new SQL.Database(bytes);
    } else {
        db = new SQL.Database();

        db.run(`
            CREATE TABLE expenses(
                id INTEGER PRIMARY KEY,
                type TEXT,
                date TEXT,
                amount REAL,
                description TEXT,
                category TEXT,
                notes TEXT
            );
        `);

        saveDatabase();
    }
}

function saveDatabase() {
    const data = db.export();
    localStorage.setItem(
        "ledgerDB",
        JSON.stringify(Array.from(data))
    );
}

function addExpense(type, date, amount, description, category, notes) {
    db.run(`
        INSERT INTO expenses
        (type, date, amount, description, category, notes)

        VALUES
        (?, ?, ?, ?, ?, ?)
    `, [type, date, amount, description, category, notes]);

    saveDatabase();
}

function getExpense(id) {
    return db.exec(
        `
        SELECT *
        FROM expenses
        WHERE id = ?;
        `,
        [id]
    );
}

function getAllExpenses(sortOption, order, limit) {
    return db.exec(`
        SELECT *
        FROM expenses
        ORDER BY ${sortOption} ${order}
        LIMIT ${limit};
    `);
}

function getOccurredExpenses(sortOption, order, limit) {
    return db.exec(`
        SELECT *
        FROM expenses
        WHERE date <= date('now')
        ORDER BY ${sortOption} ${order}
        LIMIT ${limit};
    `);
}

function getOccurredExpensesAfterDate(sortOption, order, limit, yearMonthDay) {
    return db.exec(`
        SELECT *
        FROM expenses
        WHERE date <= date('now')
        AND date >= ?
        ORDER BY ${sortOption} ${order}
        LIMIT ${limit};
    `, [yearMonthDay]);
}

function getUpcomingExpenses(sortOption, order, limit) {
    return db.exec(`
        SELECT *
        FROM expenses
        WHERE date > date('now')
        ORDER BY ${sortOption} ${order}
        LIMIT ${limit};
    `);
}

function getMonthExpenses(type, year, month) {
    const yearMonth = `${year}-${String(month).padStart(2, "0")}`;

    return db.exec(`
        SELECT *
        FROM expenses
        WHERE type = ?
        AND strftime('%Y-%m', date) = ?
    `, [type, yearMonth]);
}

function deleteExpense(id) {
    db.run(`
        DELETE
        FROM expenses
        WHERE id = ?;
    `, [id]);

    saveDatabase();
}

function filterCategory(category) {
    return db.exec(`
        SELECT *
        FROM expenses
        WHERE category = ?;
    `, [category]);
}

function sortExpenses(sortOption, order) {
    return db.exec(`
        SELECT *
        FROM expenses
        ORDER BY ${sortOption} ${order};
    `);
}

function totalAmount(type) {
    return db.exec(`
        SELECT COALESCE(SUM(amount), 0)
        FROM expenses
        WHERE type = ?;
    `, [type]);
}

function upcomingAmount(type) {
    return db.exec(`
        SELECT COALESCE(SUM(amount), 0)
        FROM expenses
        WHERE type = ?
        AND date > date('now')
    `, [type]);
}

function amountInMonth(type, year, month) {
    const yearMonth = `${year}-${String(month).padStart(2, "0")}`;

    return db.exec(`
        SELECT COALESCE(SUM(amount), 0)
        FROM expenses
        WHERE type = ?
        AND strftime('%Y-%m', date) = ?
    `, [type, yearMonth]);
}

function EntriesThisMonth(type) {
    return db.exec(`
        SELECT COALESCE(COUNT(*), 0)
        FROM expenses
        WHERE type = ?
        AND strftime('%Y-%m', date) = strftime('%Y-%m', 'now'); 
    `, [type]);
}

function countEntries(startDate, endDate) {
    return db.exec(`
        SELECT COALESCE(COUNT(*), 0)
        FROM expenses
        WHERE date BETWEEN ? AND ?;
    `, [startDate, endDate])
}