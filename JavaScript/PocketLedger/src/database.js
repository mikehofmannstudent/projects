
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
                dateTime TEXT,
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

function addExpense(type, dateTime, amount, description, category, notes) {
    db.run(`
        INSERT INTO expenses
        (type, dateTime, amount, description, category, notes)

        VALUES
        (?, ?, ?, ?, ?, ?)
    `, [type, dateTime, amount, description, category, notes]);

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
        WHERE dateTime <= ?
        ORDER BY ${sortOption} ${order}
        LIMIT ${limit};
    `, [new Date().toISOString()]);
}

function getOccurredExpensesAfterDate(sortOption, order, limit, yearMonthDay) {
    const start = `${yearMonthDay}T00:00:00.000Z`;
    const end = new Date().toISOString();

    return db.exec(`
        SELECT *
        FROM expenses
        WHERE dateTime >= ?
        AND dateTime <= ?
        ORDER BY ${sortOption} ${order}
        LIMIT ${limit};
    `, [start, end]);
}

function getUpcomingExpenses(sortOption, order, limit) {
    return db.exec(`
        SELECT *
        FROM expenses
        WHERE dateTime > ?
        ORDER BY ${sortOption} ${order}
        LIMIT ${limit};
    `, [new Date().toISOString()]);
}

function getMonthExpenses(type, year, month) {
    const start = `${year}-${String(month).padStart(2, "0")}-01T00:00:00.000Z`;
    const end = `${year}-${String(month + 1).padStart(2, "0")}-01T00:00:00.000Z`;

    return db.exec(`
        SELECT *
        FROM expenses
        WHERE type = ?
        AND dateTime >= ?
        AND dateTime < ?
    `, [type, start, end]);
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
    const currYearMonthDay = new Date().toISOString();

    return db.exec(`
        SELECT COALESCE(SUM(amount), 0)
        FROM expenses
        WHERE type = ?
        AND dateTime > ?
    `, [type, currYearMonthDay]);
}

function amountInMonth(type, year, month) {
    const start = new Date(Date.UTC(year, month - 1, 1)).toISOString();
    const end = new Date(Date.UTC(year, month, 1)).toISOString();
    return db.exec(`
        SELECT COALESCE(SUM(amount), 0)
        FROM expenses
        WHERE type = ?
        AND dateTime >= ?
        AND dateTime < ?
    `, [type, start, end]);
}

function EntriesThisMonth(type) {
    return db.exec(`
        SELECT COALESCE(COUNT(*), 0)
        FROM expenses
        WHERE type = ?
        AND strftime('%Y-%m', dateTime) = strftime('%Y-%m', 'now'); 
    `, [type]);
}

function countEntries(startDate, endDate) {
    const start = `${startDate}T00:00:00.000Z`;
    const end = `${endDate}T23:59:59.999Z`;

    return db.exec(`
        SELECT COALESCE(COUNT(*), 0)
        FROM expenses
        WHERE dateTime BETWEEN ? AND ?;
    `, [start, end]);
}

function getCategories() {
    return db.exec(`
        SELECT DISTINCT category
        FROM expenses
        ORDER BY category;
    `);
}

function deleteCategory(category) {
    db.run(
        `DELETE FROM expenses WHERE category = ?
    `, [category]);

    saveDatabase();
}